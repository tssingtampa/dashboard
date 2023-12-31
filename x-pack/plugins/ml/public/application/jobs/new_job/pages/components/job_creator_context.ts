/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createContext } from 'react';
import type { Field, Aggregation } from '@kbn/ml-anomaly-utils';
import { TimeBuckets } from '../../../../util/time_buckets';
import { JobCreatorType, SingleMetricJobCreator } from '../../common/job_creator';
import { ChartLoader } from '../../common/chart_loader';
import { MapLoader } from '../../common/map_loader';
import { ResultsLoader } from '../../common/results_loader';
import { JobValidator } from '../../common/job_validator';
import { ExistingJobsAndGroups } from '../../../../services/job_service';

export interface JobCreatorContextValue {
  jobCreatorUpdated: number;
  jobCreatorUpdate: () => void;
  jobCreator: JobCreatorType;
  chartLoader: ChartLoader;
  mapLoader: MapLoader;
  resultsLoader: ResultsLoader;
  chartInterval: TimeBuckets;
  jobValidator: JobValidator;
  jobValidatorUpdated: number;
  fields: Field[];
  aggs: Aggregation[];
  existingJobsAndGroups: ExistingJobsAndGroups;
}

export const JobCreatorContext = createContext<JobCreatorContextValue>({
  jobCreatorUpdated: 0,
  jobCreatorUpdate: () => {},
  jobCreator: {} as SingleMetricJobCreator,
  chartLoader: {} as ChartLoader,
  mapLoader: {} as MapLoader,
  resultsLoader: {} as ResultsLoader,
  chartInterval: {} as TimeBuckets,
  jobValidator: {} as JobValidator,
  jobValidatorUpdated: 0,
  fields: [],
  aggs: [],
  existingJobsAndGroups: {} as ExistingJobsAndGroups,
});
