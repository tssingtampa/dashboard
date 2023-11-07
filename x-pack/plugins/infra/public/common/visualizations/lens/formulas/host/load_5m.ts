/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { FormulaValueConfig } from '@kbn/lens-embeddable-utils';

export const load5m: FormulaValueConfig = {
  label: i18n.translate('xpack.infra.assetDetails.formulas.load5m', {
    defaultMessage: 'Load (5m)',
  }),
  value: 'average(system.load.5)',
  format: {
    id: 'number',
    params: {
      decimals: 1,
    },
  },
};