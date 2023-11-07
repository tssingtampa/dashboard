/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { get, getOr, has, set, omit, isObject, toString as fpToString } from 'lodash/fp';
import type { Action } from 'redux';
import type { Epic } from 'redux-observable';
import { from, EMPTY, merge } from 'rxjs';
import type { Filter, MatchAllFilter } from '@kbn/es-query';
import {
  isScriptedRangeFilter,
  isExistsFilter,
  isRangeFilter,
  isMatchAllFilter,
  isPhraseFilter,
  isQueryStringFilter,
  isPhrasesFilter,
} from '@kbn/es-query';
import {
  filter,
  map,
  startWith,
  withLatestFrom,
  mergeMap,
  concatMap,
  takeUntil,
} from 'rxjs/operators';

import type { TimelineErrorResponse, ResponseTimeline } from '../../../../common/api/timeline';
import type { ColumnHeaderOptions } from '../../../../common/types/timeline';
import { TimelineStatus, TimelineType } from '../../../../common/api/timeline';
import type { inputsModel } from '../../../common/store/inputs';
import { addError } from '../../../common/store/app/actions';

import { persistTimeline } from '../../containers/api';
import { ALL_TIMELINE_QUERY_ID } from '../../containers/all';
import * as i18n from '../../pages/translations';

import {
  updateTimeline,
  startTimelineSaving,
  endTimelineSaving,
  createTimeline,
  showCallOutUnauthorizedMsg,
  addTimeline,
  saveTimeline,
  setChanged,
} from './actions';
import type { TimelineModel } from './model';
import { epicPersistNote, timelineNoteActionsType } from './epic_note';
import { epicPersistPinnedEvent, timelinePinnedEventActionsType } from './epic_pinned_event';
import { epicPersistTimelineFavorite, timelineFavoriteActionsType } from './epic_favorite';
import { isNotNull } from './helpers';
import { dispatcherTimelinePersistQueue } from './epic_dispatcher_timeline_persistence_queue';
import { myEpicTimelineId } from './my_epic_timeline_id';
import type { ActionTimeline, TimelineEpicDependencies } from './types';
import type { TimelineInput } from '../../../../common/search_strategy';

const isItAtimelineAction = (timelineId: string | undefined) =>
  timelineId && timelineId.toLowerCase().startsWith('timeline');

export const createTimelineEpic =
  <State>(): Epic<Action, Action, State, TimelineEpicDependencies<State>> =>
  (
    action$,
    state$,
    {
      selectAllTimelineQuery,
      selectNotesByIdSelector,
      timelineByIdSelector,
      timelineTimeRangeSelector,
      kibana$,
    }
  ) => {
    const timeline$ = state$.pipe(map(timelineByIdSelector), filter(isNotNull));

    const allTimelineQuery$ = state$.pipe(
      map((state) => {
        const getQuery = selectAllTimelineQuery();
        return getQuery(state, ALL_TIMELINE_QUERY_ID);
      }),
      filter(isNotNull)
    );

    const notes$ = state$.pipe(map(selectNotesByIdSelector), filter(isNotNull));

    const timelineTimeRange$ = state$.pipe(map(timelineTimeRangeSelector), filter(isNotNull));

    return merge(
      action$.pipe(
        withLatestFrom(timeline$),
        filter(([action, timeline]) => {
          const timelineId: string = get('payload.id', action);
          const timelineObj: TimelineModel = timeline[timelineId];
          if (action.type === addError.type) {
            return true;
          }
          if (
            isItAtimelineAction(timelineId) &&
            timelineObj != null &&
            timelineObj.status != null &&
            TimelineStatus.immutable === timelineObj.status
          ) {
            return false;
          } else if (action.type === createTimeline.type && isItAtimelineAction(timelineId)) {
            myEpicTimelineId.setTimelineVersion(null);
            myEpicTimelineId.setTimelineId(null);
            myEpicTimelineId.setTemplateTimelineId(null);
            myEpicTimelineId.setTemplateTimelineVersion(null);
          } else if (action.type === addTimeline.type && isItAtimelineAction(timelineId)) {
            const addNewTimeline: TimelineModel = get('payload.timeline', action);
            myEpicTimelineId.setTimelineId(addNewTimeline.savedObjectId);
            myEpicTimelineId.setTimelineVersion(addNewTimeline.version);
            myEpicTimelineId.setTemplateTimelineId(addNewTimeline.templateTimelineId);
            myEpicTimelineId.setTemplateTimelineVersion(addNewTimeline.templateTimelineVersion);
            return getOr(false, 'payload.savedTimeline', action);
          } else if (
            action.type === saveTimeline.type &&
            !timelineObj.isSaving &&
            isItAtimelineAction(timelineId)
          ) {
            return true;
          }
        }),
        mergeMap(([action]) => {
          dispatcherTimelinePersistQueue.next({ action });
          return EMPTY;
        })
      ),
      dispatcherTimelinePersistQueue.pipe(
        withLatestFrom(timeline$, notes$, timelineTimeRange$),
        concatMap(([objAction, timeline, notes, timelineTimeRange]) => {
          const action: ActionTimeline = get('action', objAction);
          const timelineId = myEpicTimelineId.getTimelineId();
          const version = myEpicTimelineId.getTimelineVersion();
          const templateTimelineId = myEpicTimelineId.getTemplateTimelineId();
          const templateTimelineVersion = myEpicTimelineId.getTemplateTimelineVersion();

          if (timelineNoteActionsType.has(action.type)) {
            return epicPersistNote(
              action,
              timeline,
              notes,
              action$,
              timeline$,
              notes$,
              allTimelineQuery$
            );
          } else if (timelinePinnedEventActionsType.has(action.type)) {
            return epicPersistPinnedEvent(action, timeline, action$, timeline$, allTimelineQuery$);
          } else if (timelineFavoriteActionsType.has(action.type)) {
            return epicPersistTimelineFavorite(
              action,
              timeline,
              action$,
              timeline$,
              allTimelineQuery$
            );
          } else if (action.type === saveTimeline.type) {
            return from(
              persistTimeline({
                timelineId,
                version,
                timeline: {
                  ...convertTimelineAsInput(timeline[action.payload.id], timelineTimeRange),
                  templateTimelineId,
                  templateTimelineVersion,
                },
              })
            ).pipe(
              withLatestFrom(timeline$, allTimelineQuery$, kibana$),
              mergeMap(([result, recentTimeline, allTimelineQuery, kibana]) => {
                const error = result as TimelineErrorResponse;
                if (error.status_code != null) {
                  switch (error.status_code) {
                    // conflict
                    case 409:
                      kibana.notifications.toasts.addDanger({
                        title: i18n.TIMELINE_VERSION_CONFLICT_TITLE,
                        text: i18n.TIMELINE_VERSION_CONFLICT_DESCRIPTION,
                      });
                      break;
                    default:
                      kibana.notifications.toasts.addDanger({
                        title: i18n.UPDATE_TIMELINE_ERROR_TITLE,
                        text: error.message ?? i18n.UPDATE_TIMELINE_ERROR_TEXT,
                      });
                  }
                  return [
                    endTimelineSaving({
                      id: action.payload.id,
                    }),
                  ];
                }

                const savedTimeline = recentTimeline[action.payload.id];
                const response: ResponseTimeline = get('data.persistTimeline', result);
                if (response == null) {
                  kibana.notifications.toasts.addDanger({
                    title: i18n.UPDATE_TIMELINE_ERROR_TITLE,
                    text: i18n.UPDATE_TIMELINE_ERROR_TEXT,
                  });
                  return [
                    endTimelineSaving({
                      id: action.payload.id,
                    }),
                  ];
                }
                const callOutMsg = response.code === 403 ? [showCallOutUnauthorizedMsg()] : [];

                if (allTimelineQuery.refetch != null) {
                  (allTimelineQuery.refetch as inputsModel.Refetch)();
                }

                return [
                  updateTimeline({
                    id: action.payload.id,
                    timeline: {
                      ...savedTimeline,
                      updated: response.timeline.updated ?? undefined,
                      savedObjectId: response.timeline.savedObjectId,
                      version: response.timeline.version,
                      status: response.timeline.status ?? TimelineStatus.active,
                      timelineType: response.timeline.timelineType ?? TimelineType.default,
                      templateTimelineId: response.timeline.templateTimelineId ?? null,
                      templateTimelineVersion: response.timeline.templateTimelineVersion ?? null,
                      isSaving: false,
                    },
                  }),
                  ...callOutMsg,
                  setChanged({
                    id: action.payload.id,
                    changed: false,
                  }),
                  endTimelineSaving({
                    id: action.payload.id,
                  }),
                ].filter(Boolean);
              }),
              startWith(startTimelineSaving({ id: action.payload.id })),
              takeUntil(
                action$.pipe(
                  withLatestFrom(timeline$),
                  filter(([checkAction, updatedTimeline]) => {
                    if (
                      checkAction.type === endTimelineSaving.type &&
                      updatedTimeline[get('payload.id', checkAction)].savedObjectId != null
                    ) {
                      myEpicTimelineId.setTimelineId(
                        updatedTimeline[get('payload.id', checkAction)].savedObjectId
                      );
                      myEpicTimelineId.setTimelineVersion(
                        updatedTimeline[get('payload.id', checkAction)].version
                      );
                      myEpicTimelineId.setTemplateTimelineId(
                        updatedTimeline[get('payload.id', checkAction)].templateTimelineId
                      );
                      myEpicTimelineId.setTemplateTimelineVersion(
                        updatedTimeline[get('payload.id', checkAction)].templateTimelineVersion
                      );
                      return true;
                    }
                    return false;
                  })
                )
              )
            );
          }
          return EMPTY;
        })
      )
    );
  };

const timelineInput: TimelineInput = {
  columns: null,
  dataProviders: null,
  dataViewId: null,
  description: null,
  eqlOptions: null,
  eventType: null,
  excludedRowRendererIds: null,
  filters: null,
  kqlMode: null,
  kqlQuery: null,
  indexNames: null,
  title: null,
  timelineType: TimelineType.default,
  templateTimelineVersion: null,
  templateTimelineId: null,
  dateRange: null,
  savedQueryId: null,
  sort: null,
  status: null,
  savedSearchId: null,
};

export const convertTimelineAsInput = (
  timeline: TimelineModel,
  timelineTimeRange: inputsModel.TimeRange
): TimelineInput =>
  Object.keys(timelineInput).reduce<TimelineInput>((acc, key) => {
    if (has(key, timeline)) {
      if (key === 'kqlQuery') {
        return set(`${key}.filterQuery`, get(`${key}.filterQuery`, timeline), acc);
      } else if (key === 'dateRange') {
        return set(`${key}`, { start: timelineTimeRange.from, end: timelineTimeRange.to }, acc);
      } else if (key === 'columns' && get(key, timeline) != null) {
        return set(
          key,
          get(key, timeline).map((col: ColumnHeaderOptions) =>
            omit(['initialWidth', 'width', '__typename', 'esTypes'], col)
          ),
          acc
        );
      } else if (key === 'filters' && get(key, timeline) != null) {
        const filters = get(key, timeline);
        return set(
          key,
          filters != null
            ? filters.map((myFilter: Filter) => {
                const basicFilter = omit(['$state'], myFilter);
                return {
                  ...basicFilter,
                  meta: {
                    ...basicFilter.meta,
                    field:
                      (isMatchAllFilter(basicFilter) ||
                        isPhraseFilter(basicFilter) ||
                        isPhrasesFilter(basicFilter) ||
                        isRangeFilter(basicFilter)) &&
                      basicFilter.meta.field != null
                        ? convertToString(basicFilter.meta.field)
                        : null,
                    value:
                      basicFilter.meta.value != null
                        ? convertToString(basicFilter.meta.value)
                        : null,
                    params:
                      basicFilter.meta.params != null
                        ? convertToString(basicFilter.meta.params)
                        : null,
                  },
                  ...(isMatchAllFilter(basicFilter)
                    ? {
                        query: {
                          match_all: convertToString(
                            (basicFilter as MatchAllFilter).query.match_all
                          ),
                        },
                      }
                    : { match_all: null }),
                  ...(isExistsFilter(basicFilter) && basicFilter.query.exists != null
                    ? { query: { exists: convertToString(basicFilter.query.exists) } }
                    : { exists: null }),
                  ...((isQueryStringFilter(basicFilter) || get('query', basicFilter) != null) &&
                  basicFilter.query != null
                    ? { query: convertToString(basicFilter.query) }
                    : { query: null }),
                  ...(isRangeFilter(basicFilter) && basicFilter.query.range != null
                    ? { query: { range: convertToString(basicFilter.query.range) } }
                    : { range: null }),
                  ...(isScriptedRangeFilter(basicFilter) &&
                  basicFilter.query.script !=
                    null /* TODO remove it when PR50713 is merged || esFilters.isPhraseFilter(basicFilter) */
                    ? { query: { script: convertToString(basicFilter.query.script) } }
                    : { script: null }),
                };
              })
            : [],
          acc
        );
      }
      return set(key, get(key, timeline), acc);
    }
    return acc;
  }, timelineInput);

const convertToString = (obj: unknown) => {
  try {
    if (isObject(obj)) {
      return JSON.stringify(obj);
    }
    return fpToString(obj);
  } catch {
    return '';
  }
};