/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ElasticsearchClient } from '@kbn/core/server';

/**
 Function for collecting information about canvas usage
 */
export type TelemetryCollector = (
  getIndexForType: (type: string) => Promise<string>,
  /** Function for calling elasticsearch */
  esClient: ElasticsearchClient
) => Record<string, any>;

export interface TelemetryCustomElementDocument {
  content: string;
}

export interface TelemetryCustomElement {
  selectedNodes: Array<{
    expression: string;
  }>;
}
