/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { Dispatch } from 'redux';
import { EuiFlyoutBody, EuiForm } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { isEndpointHostIsolated } from '../../../../../../common/utils/validators';
import type { HostMetadata } from '../../../../../../../common/endpoint/types';
import type { EndpointIsolatedFormProps } from '../../../../../../common/components/endpoint/host_isolation';
import {
  ActionCompletionReturnButton,
  EndpointIsolateForm,
  EndpointIsolateSuccess,
  EndpointUnisolateForm,
} from '../../../../../../common/components/endpoint/host_isolation';
import { getEndpointDetailsPath } from '../../../../../common/routing';
import { useEndpointSelector } from '../../hooks';
import {
  getIsIsolationRequestPending,
  getIsolationRequestError,
  getWasIsolationRequestSuccessful,
  uiQueryParams,
} from '../../../store/selectors';
import type { AppAction } from '../../../../../../common/store/actions';

/**
 * Component handles both isolate and un-isolate for a given endpoint
 */
export const EndpointIsolationFlyoutPanel = memo<{
  hostMeta: HostMetadata;
}>(({ hostMeta }) => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<AppAction>>();

  const { show, ...queryParams } = useEndpointSelector(uiQueryParams);
  const isCurrentlyIsolated = isEndpointHostIsolated(hostMeta);
  const isPending = useEndpointSelector(getIsIsolationRequestPending);
  const wasSuccessful = useEndpointSelector(getWasIsolationRequestSuccessful);
  const isolateError = useEndpointSelector(getIsolationRequestError);

  const [formValues, setFormValues] = useState<
    Parameters<EndpointIsolatedFormProps['onChange']>[0]
  >({ comment: '' });

  const IsolationForm = isCurrentlyIsolated ? EndpointUnisolateForm : EndpointIsolateForm;

  const handleCancel: EndpointIsolatedFormProps['onCancel'] = useCallback(() => {
    history.push(
      getEndpointDetailsPath({
        name: 'endpointDetails',
        ...queryParams,
        selected_endpoint: hostMeta.agent.id,
      })
    );
  }, [history, hostMeta.agent.id, queryParams]);

  const handleConfirm: EndpointIsolatedFormProps['onConfirm'] = useCallback(() => {
    dispatch({
      type: 'endpointIsolationRequest',
      payload: {
        type: isCurrentlyIsolated ? 'unisolate' : 'isolate',
        data: {
          endpoint_ids: [hostMeta.agent.id],
          comment: formValues.comment,
        },
      },
    });
  }, [dispatch, formValues.comment, hostMeta.agent.id, isCurrentlyIsolated]);

  const handleChange: EndpointIsolatedFormProps['onChange'] = useCallback((changes) => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        ...changes,
      };
    });
  }, []);

  return (
    <>
      {wasSuccessful && (
        <EndpointIsolateSuccess
          hostName={hostMeta.host.name}
          isolateAction={isCurrentlyIsolated ? 'unisolateHost' : 'isolateHost'}
        />
      )}
      <EuiFlyoutBody>
        {wasSuccessful ? (
          <ActionCompletionReturnButton
            onClick={handleCancel}
            buttonText={i18n.translate(
              'xpack.securitySolution.endpoint.hostIsolation.successProceedButton',
              { defaultMessage: 'Return to endpoint details' }
            )}
          />
        ) : (
          <EuiForm
            isInvalid={!!isolateError}
            error={isolateError?.message}
            data-test-subj="endpointIsolationForm"
          >
            <IsolationForm
              comment={formValues.comment}
              isLoading={isPending}
              hostName={hostMeta.host.name}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
              onChange={handleChange}
            />
          </EuiForm>
        )}
      </EuiFlyoutBody>
    </>
  );
});
EndpointIsolationFlyoutPanel.displayName = 'EndpointIsolateFlyoutPanel';
