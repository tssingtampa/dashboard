/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';

import { shallow } from 'enzyme';

import { EuiEmptyPrompt } from '@elastic/eui';

import { EmptySearchApplicationsPrompt } from './empty_search_applications_prompt';

describe('EmptySearchApplicationsPrompt', () => {
  it('should pass children to prompt actions', () => {
    const dummyEl = <div>dummy</div>;
    const wrapper = shallow(
      <EmptySearchApplicationsPrompt>{dummyEl}</EmptySearchApplicationsPrompt>
    );
    const euiPrompt = wrapper.find(EuiEmptyPrompt);

    expect(euiPrompt.prop('actions')).toEqual(dummyEl);
  });
});
