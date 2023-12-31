/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { MlAnomaliesTableRecord } from '@kbn/ml-anomaly-utils';

export function getQueryStringForInfluencers(
  influencers: MlAnomaliesTableRecord['influencers'] = [],
  entityName?: string
) {
  return influencers
    .reduce<string[]>((acc, influencer) => {
      Object.entries(influencer)
        .filter(([name]) => name !== entityName)
        .forEach(([name, inf]) => acc.push(`${name}: ${inf}`));
      return acc;
    }, [])
    .join(' or ');
}
