/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { SessionViewPlugin } from './plugin';

export type { SessionViewStart } from './types';
export { ENTRY_SESSION_ENTITY_ID_PROPERTY } from '../common';

export function plugin() {
  return new SessionViewPlugin();
}
