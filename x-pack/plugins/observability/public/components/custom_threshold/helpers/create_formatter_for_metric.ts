/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import numeral from '@elastic/numeral';
import { InfraFormatterType } from '../../../../common/custom_threshold_rule/types';
import { createFormatter } from '../../../../common/custom_threshold_rule/formatters';
import { MetricsExplorerMetric } from '../../../../common/custom_threshold_rule/metrics_explorer';
import { metricToFormat } from './metric_to_format';

export const createFormatterForMetric = (metric?: MetricsExplorerMetric) => {
  if (metric?.aggregation === 'custom') {
    return (input: number) => numeral(input).format('0.[0000]');
  }
  if (metric && metric.field) {
    const format = metricToFormat(metric);
    if (format === InfraFormatterType.bits && metric.aggregation === 'rate') {
      return createFormatter(InfraFormatterType.bits, '{{value}}/s');
    }
    return createFormatter(format);
  }
  return createFormatter(InfraFormatterType.number);
};
