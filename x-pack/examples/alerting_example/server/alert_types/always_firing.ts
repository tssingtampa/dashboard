/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { v4 as uuidv4 } from 'uuid';
import { range } from 'lodash';
import { RuleType } from '@kbn/alerting-plugin/server';
import { schema } from '@kbn/config-schema';
import {
  DEFAULT_INSTANCES_TO_GENERATE,
  ALERTING_EXAMPLE_APP_ID,
  AlwaysFiringParams,
  AlwaysFiringActionGroupIds,
} from '../../common/constants';

type ActionGroups = 'small' | 'medium' | 'large';
const DEFAULT_ACTION_GROUP: ActionGroups = 'small';

function getTShirtSizeByIdAndThreshold(
  id: string,
  thresholds: AlwaysFiringParams['thresholds']
): ActionGroups {
  const idAsNumber = parseInt(id, 10);
  if (!isNaN(idAsNumber)) {
    if (thresholds?.large && thresholds.large < idAsNumber) {
      return 'large';
    }
    if (thresholds?.medium && thresholds.medium < idAsNumber) {
      return 'medium';
    }
    if (thresholds?.small && thresholds.small < idAsNumber) {
      return 'small';
    }
  }
  return DEFAULT_ACTION_GROUP;
}

export const alertType: RuleType<
  AlwaysFiringParams,
  never,
  { count?: number },
  { triggerdOnCycle: number },
  never,
  AlwaysFiringActionGroupIds
> = {
  id: 'example.always-firing',
  name: 'Always firing',
  actionGroups: [
    { id: 'small', name: 'Small t-shirt' },
    { id: 'medium', name: 'Medium t-shirt' },
    { id: 'large', name: 'Large t-shirt' },
  ],
  defaultActionGroupId: DEFAULT_ACTION_GROUP,
  minimumLicenseRequired: 'basic',
  isExportable: true,
  async executor({
    services,
    params: { instances = DEFAULT_INSTANCES_TO_GENERATE, thresholds },
    state,
  }) {
    const count = (state.count ?? 0) + 1;

    range(instances)
      .map(() => uuidv4())
      .forEach((id: string) => {
        services.alertFactory
          .create(id)
          .replaceState({ triggerdOnCycle: count })
          .scheduleActions(getTShirtSizeByIdAndThreshold(id, thresholds));
      });

    return {
      state: {
        count,
      },
    };
  },
  category: 'kibana',
  producer: ALERTING_EXAMPLE_APP_ID,
  validate: {
    params: schema.object({
      instances: schema.maybe(schema.number()),
      thresholds: schema.maybe(
        schema.object({
          small: schema.maybe(schema.number()),
          medium: schema.maybe(schema.number()),
          large: schema.maybe(schema.number()),
        })
      ),
    }),
  },
};
