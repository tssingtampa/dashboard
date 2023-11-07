/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mapKeys } from 'lodash';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import { i18n } from '@kbn/i18n';
import type { GetOneAgentPolicyResponse } from '@kbn/fleet-plugin/common';
import { API_VERSIONS } from '../../common/constants';
import { useKibana } from '../common/lib/kibana';
import { useErrorToast } from '../common/hooks/use_error_toast';

export const useAgentPolicies = (policyIds: string[] = []) => {
  const { http } = useKibana().services;
  const setErrorToast = useErrorToast();

  const agentResponse = useQueries({
    queries: policyIds.map((policyId) => ({
      queryKey: ['agentPolicy', policyId],
      queryFn: () =>
        http.get(`/internal/osquery/fleet_wrapper/agent_policies/${policyId}`, {
          version: API_VERSIONS.internal.v1,
        }),
      enabled: policyIds.length > 0,
      onSuccess: () => setErrorToast(),

      onError: (error: Error) =>
        setErrorToast(error, {
          title: i18n.translate('xpack.osquery.action_policy_details.fetchError', {
            defaultMessage: 'Error while fetching policy details',
          }),
        }),
    })),
  }) as Array<UseQueryResult<GetOneAgentPolicyResponse>>;

  const agentPoliciesLoading = agentResponse.some((p) => p.isLoading);
  const agentPolicies = agentResponse.map((p) => p.data?.item);
  const agentPolicyById = mapKeys(agentPolicies, 'id');

  return { agentPoliciesLoading, agentPolicies, agentPolicyById };
};
