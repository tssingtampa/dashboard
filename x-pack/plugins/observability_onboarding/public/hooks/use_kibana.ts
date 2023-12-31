/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreStart } from '@kbn/core/public';
import {
  context as KibanaContext,
  KibanaContextProvider,
  useKibana,
} from '@kbn/kibana-react-plugin/public';

export type Services = CoreStart;

const useTypedKibana = () => useKibana<Services>();

export { KibanaContextProvider, useTypedKibana as useKibana, KibanaContext };
