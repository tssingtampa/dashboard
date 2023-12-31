/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Plugin, CoreSetup, CoreStart } from '@kbn/core/server';
import { EmbeddableSetup } from '@kbn/embeddable-plugin/server';

export interface EmbeddableExamplesSetupDependencies {
  embeddable: EmbeddableSetup;
}

export class EmbeddableExamplesPlugin
  implements Plugin<void, void, EmbeddableExamplesSetupDependencies>
{
  public setup(core: CoreSetup, { embeddable }: EmbeddableExamplesSetupDependencies) {}

  public start(core: CoreStart) {}

  public stop() {}
}
