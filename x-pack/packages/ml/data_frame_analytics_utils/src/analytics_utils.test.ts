/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getAnalysisType, isOutlierAnalysis } from './analytics_utils';

describe('Data Frame Analytics: Analytics utils', () => {
  test('getAnalysisType()', () => {
    const outlierAnalysis = { outlier_detection: {} };
    expect(getAnalysisType(outlierAnalysis)).toBe('outlier_detection');

    const regressionAnalysis = { regression: {} };
    // @ts-expect-error incomplete regression analysis
    expect(getAnalysisType(regressionAnalysis)).toBe('regression');

    // test against a job type that does not exist yet.
    const otherAnalysis = { other: {} };
    // @ts-expect-error unknown analysis type
    expect(getAnalysisType(otherAnalysis)).toBe('other');

    // if the analysis object has a shape that is not just a single property,
    // the job type will be returned as 'unknown'.
    const unknownAnalysis = { outlier_detection: {}, regression: {} };
    // @ts-expect-error unknown analysis type
    expect(getAnalysisType(unknownAnalysis)).toBe('unknown');
  });

  test('isOutlierAnalysis()', () => {
    const outlierAnalysis = { outlier_detection: {} };
    expect(isOutlierAnalysis(outlierAnalysis)).toBe(true);

    const regressionAnalysis = { regression: {} };
    expect(isOutlierAnalysis(regressionAnalysis)).toBe(false);

    const unknownAnalysis = { outlier_detection: {}, regression: {} };
    expect(isOutlierAnalysis(unknownAnalysis)).toBe(false);
  });
});
