/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import path from 'path';
import type { FtrProviderContext } from '../../functional/ftr_provider_context';

// eslint-disable-next-line import/no-default-export
export default function ({
  getService,
  getPageObjects,
  updateBaselines,
}: FtrProviderContext & { updateBaselines: boolean }) {
  const PageObjects = getPageObjects(['common', 'reporting']);
  const browser = getService('browser');
  const testSubjects = getService('testSubjects');
  const png = getService('png');
  const config = getService('config');
  const log = getService('log');
  const screenshotDir = config.get('screenshots.directory');

  const appId = 'reportingExample';

  const fixtures = {
    baselineAPng: path.resolve(__dirname, 'fixtures/baseline/capture_a.png'),
    baselineAPdf: path.resolve(__dirname, 'fixtures/baseline/capture_a.pdf'),
    baselineAPdfPrint: path.resolve(__dirname, 'fixtures/baseline/capture_a_print.pdf'),
  };

  // NOTE: Occasionally, you may need to run the test and copy the "session" image file and replace the
  // "baseline" image file to reflect current renderings. The source and destination file paths can be found in
  // the INFO logs for this test run.
  describe('Captures', () => {
    before(async () => {
      await browser.setWindowSize(1600, 1000);
    });

    it('PNG file matches the baseline image', async () => {
      await PageObjects.common.navigateToApp(appId);

      await (await testSubjects.find('shareButton')).click();
      await (await testSubjects.find('captureTestPanel')).click();
      await (await testSubjects.find('captureTestPNG')).click();

      await PageObjects.reporting.clickGenerateReportButton();
      const url = await PageObjects.reporting.getReportURL(60000);
      const captureData = await PageObjects.reporting.getRawPdfReportData(url);

      const pngSessionFilePath = await PageObjects.reporting.writeSessionReport(
        'capture_test_baseline_a',
        'png',
        captureData,
        screenshotDir
      );

      log.info(
        `session image path: ${pngSessionFilePath}` +
          `, baseline image path: ${fixtures.baselineAPng}`
      );

      expect(
        await png.compareAgainstBaseline(
          pngSessionFilePath,
          fixtures.baselineAPng,
          screenshotDir,
          updateBaselines
        )
      ).to.be.lessThan(0.03);
    });
  });
}
