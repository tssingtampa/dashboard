/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { NOTIFICATION_DEFAULT_FREQUENCY } from '@kbn/security-solution-plugin/common/constants';
import { getSimpleRuleOutput } from './get_simple_rule_output';
import { RuleWithoutServerGeneratedProperties } from './remove_server_generated_properties';

export const getSimpleRuleOutputWithWebHookAction = (
  actionId: string,
  uuid: string
): RuleWithoutServerGeneratedProperties => ({
  ...getSimpleRuleOutput(),
  actions: [
    {
      action_type_id: '.webhook',
      group: 'default',
      id: actionId,
      params: {
        body: '{}',
      },
      uuid,
      frequency: NOTIFICATION_DEFAULT_FREQUENCY,
    },
  ],
});
