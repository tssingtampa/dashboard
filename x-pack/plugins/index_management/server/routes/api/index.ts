/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { API_BASE_PATH, INTERNAL_API_BASE_PATH } from '../../../common';

export const addBasePath = (uri: string): string => API_BASE_PATH + uri;

export const addInternalBasePath = (uri: string): string => INTERNAL_API_BASE_PATH + uri;
