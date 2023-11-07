/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrProviderContext } from '../../common/ftr_provider_context';

// eslint-disable-next-line import/no-default-export
export default ({ loadTestFile }: FtrProviderContext): void => {
  describe('detection engine api security and spaces enabled - Group 10', function () {
    // !!NOTE: For new routes that do any updates on a rule, please ensure that you are including the legacy
    // action migration code. We are monitoring legacy action telemetry to clean up once we see their
    // existence being near 0.

    loadTestFile(require.resolve('./get_rule_execution_results'));
    loadTestFile(require.resolve('./import_rules'));
    loadTestFile(require.resolve('./import_export_rules'));
    loadTestFile(require.resolve('./read_rules'));
    loadTestFile(require.resolve('./resolve_read_rules'));
    loadTestFile(require.resolve('./update_rules'));
    loadTestFile(require.resolve('./update_rules_bulk'));
    loadTestFile(require.resolve('./patch_rules_bulk'));
    loadTestFile(require.resolve('./perform_bulk_action'));
    loadTestFile(require.resolve('./perform_bulk_action_dry_run'));
    loadTestFile(require.resolve('./patch_rules'));
    loadTestFile(require.resolve('./read_privileges'));
    loadTestFile(require.resolve('./timestamps'));
    loadTestFile(require.resolve('./runtime'));
    loadTestFile(require.resolve('./throttle'));
    loadTestFile(require.resolve('./ignore_fields'));
    loadTestFile(require.resolve('./risk_engine/init_and_status_apis'));
    loadTestFile(require.resolve('./risk_engine/risk_score_preview'));
    loadTestFile(require.resolve('./risk_engine/risk_score_calculation'));
    loadTestFile(require.resolve('./risk_engine/risk_scoring_task_execution'));
    loadTestFile(require.resolve('./risk_engine/telemetry_usage'));
  });
};