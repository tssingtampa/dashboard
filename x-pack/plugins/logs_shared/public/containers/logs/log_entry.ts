/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback } from 'react';
import { LogViewReference } from '../../../common/log_views';
import { decodeOrThrow } from '../../../common/runtime_types';
import {
  logEntrySearchRequestParamsRT,
  logEntrySearchResponsePayloadRT,
  LOG_ENTRY_SEARCH_STRATEGY,
} from '../../../common/search_strategies/log_entries/log_entry';
import {
  normalizeDataSearchResponses,
  useDataSearch,
  useLatestPartialDataSearchResponse,
} from '../../utils/data_search';

export const useLogEntry = ({
  logViewReference,
  logEntryId,
}: {
  logViewReference: LogViewReference | null | undefined;
  logEntryId: string | null | undefined;
}) => {
  const { search: fetchLogEntry, requests$: logEntrySearchRequests$ } = useDataSearch({
    getRequest: useCallback(() => {
      return !!logEntryId && !!logViewReference
        ? {
            request: {
              params: logEntrySearchRequestParamsRT.encode({
                logView: logViewReference,
                logEntryId,
              }),
            },
            options: { strategy: LOG_ENTRY_SEARCH_STRATEGY },
          }
        : null;
    }, [logViewReference, logEntryId]),
    parseResponses: parseLogEntrySearchResponses,
  });

  const {
    cancelRequest,
    isRequestRunning,
    isResponsePartial,
    latestResponseData,
    latestResponseErrors,
    loaded,
    total,
  } = useLatestPartialDataSearchResponse(logEntrySearchRequests$);

  return {
    cancelRequest,
    errors: latestResponseErrors,
    fetchLogEntry,
    isRequestRunning,
    isResponsePartial,
    loaded,
    logEntry: latestResponseData ?? null,
    total,
  };
};

const parseLogEntrySearchResponses = normalizeDataSearchResponses(
  null,
  decodeOrThrow(logEntrySearchResponsePayloadRT)
);
