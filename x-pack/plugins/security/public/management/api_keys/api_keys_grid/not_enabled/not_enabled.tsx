/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiLink } from '@elastic/eui';
import React from 'react';

import { FormattedMessage } from '@kbn/i18n-react';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { KibanaPageTemplate } from '@kbn/shared-ux-page-kibana-template';

export const NotEnabled: React.FunctionComponent = () => {
  const docLinks = useKibana().services.docLinks!;
  return (
    <KibanaPageTemplate.EmptyPrompt
      title={
        <h2>
          <FormattedMessage
            id="xpack.security.management.apiKeys.table.apiKeysDisabledErrorTitle"
            defaultMessage="API keys not enabled in Elasticsearch"
          />
        </h2>
      }
      color="danger"
      iconType="warning"
      body={
        <p>
          <FormattedMessage
            id="xpack.security.management.apiKeys.table.apiKeysDisabledErrorDescription"
            defaultMessage="Contact your system administrator and refer to the {link} to enable API keys."
            values={{
              link: (
                <EuiLink href={`${docLinks.links.security.apiKeyServiceSettings}`} target="_blank">
                  <FormattedMessage
                    id="xpack.security.management.apiKeys.table.apiKeysDisabledErrorLinkText"
                    defaultMessage="docs"
                  />
                </EuiLink>
              ),
            }}
          />
        </p>
      }
    />
  );
};
