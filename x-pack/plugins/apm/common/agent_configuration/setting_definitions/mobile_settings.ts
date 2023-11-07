/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { RawSettingDefinition } from './types';

export const mobileSettings: RawSettingDefinition[] = [
  // Session sample rate
  {
    key: 'session_sample_rate',
    type: 'float',
    defaultValue: '1.0',
    label: i18n.translate('xpack.apm.agentConfig.sessionSampleRate.label', {
      defaultMessage: 'Session sample rate',
    }),
    description: i18n.translate(
      'xpack.apm.agentConfig.sessionSampleRate.description',
      {
        defaultMessage:
          "By default, the agent will sample all signals generated by your application (e.g. spans, metrics, & logs). To reduce overhead and storage requirements, you can set the sample rate to a value between 0.0 and 1.0. When reduced below 1.0, data will be sampled per session. This is so context in a given session isn't lost.",
      }
    ),
    includeAgents: ['iOS/swift', 'android/java'],
  },
];