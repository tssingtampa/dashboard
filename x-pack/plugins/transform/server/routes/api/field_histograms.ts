/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { fetchHistogramsForFields } from '@kbn/ml-agg-utils';
import { addInternalBasePath } from '../../../common/constants';

import { dataViewTitleSchema, DataViewTitleSchema } from '../../../common/api_schemas/common';
import {
  fieldHistogramsRequestSchema,
  FieldHistogramsRequestSchema,
} from '../../../common/api_schemas/field_histograms';
import { RouteDependencies } from '../../types';

import { wrapError, wrapEsError } from './error_utils';

export function registerFieldHistogramsRoutes({ router, license }: RouteDependencies) {
  router.versioned
    .post({
      path: addInternalBasePath('field_histograms/{dataViewTitle}'),
      access: 'internal',
    })
    .addVersion<DataViewTitleSchema, undefined, FieldHistogramsRequestSchema>(
      {
        version: '1',
        validate: {
          request: {
            params: dataViewTitleSchema,
            body: fieldHistogramsRequestSchema,
          },
        },
      },
      license.guardApiRoute<DataViewTitleSchema, undefined, FieldHistogramsRequestSchema>(
        async (ctx, req, res) => {
          const { dataViewTitle } = req.params;
          const { query, fields, runtimeMappings, samplerShardSize } = req.body;

          try {
            const esClient = (await ctx.core).elasticsearch.client;
            const resp = await fetchHistogramsForFields(
              esClient.asCurrentUser,
              dataViewTitle,
              query,
              fields,
              samplerShardSize,
              runtimeMappings
            );

            return res.ok({ body: resp });
          } catch (e) {
            return res.customError(wrapError(wrapEsError(e)));
          }
        }
      )
    );
}
