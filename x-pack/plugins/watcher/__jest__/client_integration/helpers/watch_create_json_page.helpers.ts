/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { act } from 'react-dom/test-utils';

import { registerTestBed, TestBed, AsyncTestBedConfig } from '@kbn/test-jest-helpers';
import { HttpSetup } from '@kbn/core/public';

import { WatchEditPage } from '../../../public/application/sections/watch_edit_page';
import { registerRouter } from '../../../public/application/lib/navigation';
import { ROUTES, WATCH_TYPES } from '../../../common/constants';
import { WithAppDependencies } from './setup_environment';

const testBedConfig: AsyncTestBedConfig = {
  memoryRouter: {
    onRouter: (router) => registerRouter(router),
    initialEntries: [`${ROUTES.API_ROOT}/watches/new-watch/${WATCH_TYPES.JSON}`],
    componentRoutePath: `${ROUTES.API_ROOT}/watches/new-watch/:type`,
  },
  doMountAsync: true,
};

export interface WatchCreateJsonTestBed extends TestBed<WatchCreateJsonTestSubjects> {
  actions: {
    selectTab: (tab: 'edit' | 'simulate') => Promise<void>;
    clickSubmitButton: () => Promise<void>;
    clickSimulateButton: () => Promise<void>;
  };
}

export const setup = async (httpSetup: HttpSetup): Promise<WatchCreateJsonTestBed> => {
  const initTestBed = registerTestBed(WithAppDependencies(WatchEditPage, httpSetup), testBedConfig);
  const testBed = await initTestBed();
  const { find, component } = testBed;

  /**
   * User Actions
   */

  const selectTab = async (tab: 'edit' | 'simulate') => {
    const tabs = ['edit', 'simulate'];

    await act(async () => {
      find('tab').at(tabs.indexOf(tab)).simulate('click');
    });

    component.update();
  };

  const clickSubmitButton = async () => {
    await act(async () => {
      testBed.find('saveWatchButton').simulate('click');
    });

    component.update();
  };

  const clickSimulateButton = async () => {
    await act(async () => {
      testBed.find('simulateWatchButton').simulate('click');
    });

    component.update();
  };

  return {
    ...testBed,
    actions: {
      selectTab,
      clickSubmitButton,
      clickSimulateButton,
    },
  };
};

type WatchCreateJsonTestSubjects = TestSubjects;

export type TestSubjects =
  | 'actionModesSelect'
  | 'idInput'
  | 'ignoreConditionSwitch'
  | 'jsonEditor'
  | 'jsonWatchForm'
  | 'jsonWatchSimulateForm'
  | 'nameInput'
  | 'pageTitle'
  | 'saveWatchButton'
  | 'scheduledTimeInput'
  | 'sectionError'
  | 'sectionLoading'
  | 'simulateResultsFlyout'
  | 'simulateResultsFlyoutTitle'
  | 'simulateWatchButton'
  | 'tab'
  | 'triggeredTimeInput'
  | 'simulateResultsTable'
  | 'conditionMetStatus'
  | 'conditionNotMetStatus';
