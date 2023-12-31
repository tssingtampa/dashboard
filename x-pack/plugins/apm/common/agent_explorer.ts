/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export enum AgentExplorerFieldName {
  ServiceName = 'serviceName',
  Environments = 'environments',
  AgentName = 'agentName',
  AgentVersion = 'agentVersion',
  AgentLastVersion = 'agentLastVersion',
  AgentDocsPageUrl = 'agentDocsPageUrl',
  Instances = 'instances',
}

export interface ElasticApmAgentLatestVersion {
  latest_version: string;
}

export interface OtelAgentLatestVersion {
  sdk_latest_version: string;
  auto_latest_version?: string;
}
