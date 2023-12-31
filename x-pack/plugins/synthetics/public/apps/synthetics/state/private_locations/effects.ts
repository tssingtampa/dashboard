/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { takeLeading } from 'redux-saga/effects';
import { fetchEffectFactory } from '../utils/fetch_effect';
import { fetchAgentPolicies, getSyntheticsPrivateLocations } from './api';
import { getAgentPoliciesAction, getPrivateLocationsAction } from './actions';

export function* fetchAgentPoliciesEffect() {
  yield takeLeading(
    getAgentPoliciesAction.get,
    fetchEffectFactory(
      fetchAgentPolicies,
      getAgentPoliciesAction.success,
      getAgentPoliciesAction.fail
    )
  );
}

export function* fetchPrivateLocationsEffect() {
  yield takeLeading(
    getPrivateLocationsAction.get,
    fetchEffectFactory(
      getSyntheticsPrivateLocations,
      getPrivateLocationsAction.success,
      getPrivateLocationsAction.fail
    )
  );
}
