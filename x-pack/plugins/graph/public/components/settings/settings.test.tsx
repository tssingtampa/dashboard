/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiListGroupItem, EuiAccordion, EuiFieldText } from '@elastic/eui';
import * as Rx from 'rxjs';
import { mountWithIntl } from '@kbn/test-jest-helpers';
import { Settings, SettingsWorkspaceProps } from './settings';
import { act } from '@testing-library/react';
import { ReactWrapper } from 'enzyme';
import { UrlTemplateForm } from './url_template_form';
import {
  GraphStore,
  updateSettings,
  loadFields,
  saveTemplate,
  removeTemplate,
} from '../../state_management';
import { createMockGraphStore } from '../../state_management/mocks';
import { Provider } from 'react-redux';
import { UrlTemplate } from '../../types';

jest.mock('@elastic/eui', () => {
  const original = jest.requireActual('@elastic/eui');

  return {
    ...original,
    htmlIdGenerator: (fn: unknown) => {
      let counter = 0;
      return () => String(counter++);
    },
  };
});

describe('settings', () => {
  let store: GraphStore;
  let dispatchSpy: jest.Mock;

  const initialTemplate: UrlTemplate = {
    description: 'template',
    encoder: {
      description: 'test encoder description',
      encode: jest.fn(),
      id: 'test',
      title: 'test encoder',
      type: 'esq',
    },
    url: 'http://example.org',
    icon: {
      id: 'test',
      package: 'eui',
      prevName: '',
      label: 'test',
    },
    isDefault: false,
  };

  const workspaceProps: jest.Mocked<SettingsWorkspaceProps> = {
    blocklistedNodes: [
      {
        x: 0,
        y: 0,
        scaledSize: 10,
        parent: null,
        color: 'black',
        data: {
          field: 'A',
          term: '1',
        },
        label: 'blocklisted node 1',
        icon: {
          id: 'test',
          package: 'eui',
          prevName: '',
          label: 'test',
        },
      },
      {
        x: 0,
        y: 0,
        scaledSize: 10,
        parent: null,
        color: 'black',
        data: {
          field: 'A',
          term: '1',
        },
        label: 'blocklisted node 2',
        icon: {
          id: 'test',
          package: 'eui',
          prevName: '',
          label: 'test',
        },
      },
    ],
    unblockNode: jest.fn(),
    unblockAll: jest.fn(),
    canEditDrillDownUrls: true,
  };

  let subject: Rx.BehaviorSubject<jest.Mocked<SettingsWorkspaceProps>>;
  let instance: ReactWrapper;

  beforeEach(() => {
    store = createMockGraphStore({}).store;
    store.dispatch(
      updateSettings({
        maxValuesPerDoc: 5,
        minDocCount: 10,
        sampleSize: 12,
        useSignificance: true,
        timeoutMillis: 10000,
      })
    );
    store.dispatch(
      loadFields([
        {
          selected: false,
          color: 'black',
          name: 'B',
          type: 'string',
          icon: {
            id: 'test',
            package: 'eui',
            prevName: '',
            label: 'test',
          },
          aggregatable: true,
        },
        {
          selected: false,
          color: 'red',
          name: 'C',
          type: 'string',
          icon: {
            id: 'test',
            package: 'eui',
            prevName: '',
            label: 'test',
          },
          aggregatable: true,
        },
      ])
    );
    store.dispatch(
      saveTemplate({
        index: -1,
        template: initialTemplate,
      })
    );
    dispatchSpy = jest.fn(store.dispatch);
    store.dispatch = dispatchSpy;
    subject = new Rx.BehaviorSubject(workspaceProps);
    instance = mountWithIntl(
      <Provider store={store}>
        <Settings observable={subject.asObservable()} />
      </Provider>
    );
  });

  function toTab(testSubj: string) {
    act(() => {
      instance.find(`EuiTab[data-test-subj="${testSubj}"]`).prop('onClick')!({} as any);
    });
    instance.update();
  }

  function input(label: string) {
    return instance.find({ label }).find('input');
  }

  describe('advanced settings', () => {
    it('should display advanced settings', () => {
      expect(input('Sample size').prop('value')).toEqual(12);
    });

    it('should set advanced settings', () => {
      input('Sample size').prop('onChange')!({
        target: { valueAsNumber: 13 },
      } as React.ChangeEvent<HTMLInputElement>);

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSettings(
          expect.objectContaining({
            timeoutMillis: 10000,
            sampleSize: 13,
          })
        )
      );
    });

    it('should let the user edit and empty the field to input a new number', () => {
      act(() => {
        input('Sample size').prop('onChange')!({
          target: { value: '', valueAsNumber: NaN },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      // Central state should not be called
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        updateSettings(
          expect.objectContaining({
            timeoutMillis: 10000,
            sampleSize: NaN,
          })
        )
      );

      // Update the local state
      instance.update();
      // Now check that local state should reflect what the user sent
      expect(input('Sample size').prop('value')).toEqual('');
    });
  });

  describe('blocklist', () => {
    beforeEach(() => {
      toTab('blocklist');
    });

    it('should switch tab to blocklist', () => {
      expect(instance.find(EuiListGroupItem).map((item) => item.prop('label'))).toEqual([
        'blocklisted node 1',
        'blocklisted node 2',
      ]);
    });

    it('should update on new data', () => {
      act(() => {
        subject.next({
          ...workspaceProps,
          blocklistedNodes: [
            {
              x: 0,
              y: 0,
              scaledSize: 10,
              parent: null,
              color: 'black',
              data: {
                field: 'A',
                term: '1',
              },
              label: 'blocklisted node 3',
              icon: {
                id: 'test',
                package: 'eui',
                label: 'test',
                prevName: '',
              },
            },
          ],
        });
      });

      instance.update();

      expect(instance.find(EuiListGroupItem).map((item) => item.prop('label'))).toEqual([
        'blocklisted node 3',
      ]);
    });

    it('should delete node', () => {
      instance.find(EuiListGroupItem).at(0).prop('extraAction')!.onClick!({} as any);

      expect(workspaceProps.unblockNode).toHaveBeenCalledWith(workspaceProps.blocklistedNodes![0]);
    });

    it('should delete all nodes', () => {
      instance.find('button[data-test-subj="graphUnblocklistAll"]').simulate('click');

      expect(workspaceProps.unblockAll).toHaveBeenCalled();
    });
  });

  describe('url templates', () => {
    function templateForm(index: number) {
      return instance.find(UrlTemplateForm).at(index);
    }

    function insert(formIndex: number, label: string, value: string) {
      act(() => {
        templateForm(formIndex).find({ label }).first().find(EuiFieldText).prop('onChange')!({
          target: { value },
        } as React.ChangeEvent<HTMLInputElement>);
      });
      instance.update();
    }

    beforeEach(() => {
      toTab('drillDowns');
    });

    it('should switch tab to url templates', () => {
      expect(instance.find(EuiAccordion).at(0).prop('buttonContent')).toEqual('template');
    });

    it('should delete url template', () => {
      templateForm(0)
        .find('EuiButtonEmpty[data-test-subj="graphRemoveUrlTemplate"]')
        .simulate('click');
      expect(dispatchSpy).toHaveBeenCalledWith(removeTemplate(initialTemplate));
    });

    it('should update url template', () => {
      insert(0, 'Title', 'Updated title');
      act(() => {
        templateForm(0).find('form').simulate('submit');
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveTemplate({ index: 0, template: { ...initialTemplate, description: 'Updated title' } })
      );
    });

    it('should add url template', async () => {
      act(() => {
        instance.find('button[data-test-subj="graphAddNewTemplate"]').simulate('click');
      });
      instance.update();

      insert(1, 'URL', 'test-url');
      insert(1, 'Title', 'Title');

      act(() => {
        templateForm(1).find('form').simulate('submit');
      });
      expect(dispatchSpy).toHaveBeenCalledWith(
        saveTemplate({
          index: -1,
          template: expect.objectContaining({ description: 'Title', url: 'test-url' }),
        })
      );
    });
  });
});
