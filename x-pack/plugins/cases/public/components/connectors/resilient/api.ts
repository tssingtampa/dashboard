/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { HttpSetup } from '@kbn/core/public';
import { getExecuteConnectorUrl } from '../../../../common/utils/connectors_api';
import type { ConnectorExecutorResult } from '../rewrite_response_to_camel_case';
import { rewriteResponseToCamelCase } from '../rewrite_response_to_camel_case';
import type { ResilientIncidentTypes, ResilientSeverity } from './types';

export const BASE_ACTION_API_PATH = '/api/actions';

export interface Props {
  http: HttpSetup;
  connectorId: string;
  signal?: AbortSignal;
}

export async function getIncidentTypes({ http, connectorId, signal }: Props) {
  const res = await http.post<ConnectorExecutorResult<ResilientIncidentTypes>>(
    getExecuteConnectorUrl(connectorId),
    {
      body: JSON.stringify({
        params: { subAction: 'incidentTypes', subActionParams: {} },
      }),
      signal,
    }
  );

  return rewriteResponseToCamelCase(res);
}

export async function getSeverity({ http, connectorId, signal }: Props) {
  const res = await http.post<ConnectorExecutorResult<ResilientSeverity>>(
    getExecuteConnectorUrl(connectorId),
    {
      body: JSON.stringify({
        params: { subAction: 'severity', subActionParams: {} },
      }),
      signal,
    }
  );

  return rewriteResponseToCamelCase(res);
}
