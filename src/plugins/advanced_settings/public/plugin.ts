/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import { CoreSetup, Plugin } from '@kbn/core/public';
import { SectionRegistry } from '@kbn/management-settings-section-registry';
import { AdvancedSettingsSetup, AdvancedSettingsStart, AdvancedSettingsPluginSetup } from './types';

const { setup: sectionRegistrySetup, start: sectionRegistryStart } = new SectionRegistry();

const title = i18n.translate('advancedSettings.advancedSettingsLabel', {
  defaultMessage: 'Advanced Settings',
});

export class AdvancedSettingsPlugin
  implements Plugin<AdvancedSettingsSetup, AdvancedSettingsStart, AdvancedSettingsPluginSetup>
{
  public setup(
    core: CoreSetup,
    { management, home, usageCollection }: AdvancedSettingsPluginSetup
  ) {
    const kibanaSection = management.sections.section.kibana;

    kibanaSection.registerApp({
      id: 'settings',
      title,
      order: 3,
      async mount(params) {
        const { mountManagementSection } = await import(
          './management_app/mount_management_section'
        );
        return mountManagementSection(
          core.getStartServices,
          params,
          sectionRegistryStart,
          usageCollection
        );
      },
    });

    if (home) {
      home.featureCatalogue.register({
        id: 'advanced_settings',
        title,
        description: i18n.translate('advancedSettings.featureCatalogueTitle', {
          defaultMessage:
            'Customize your Kibana experience — change the date format, turn on dark mode, and more.',
        }),
        icon: 'gear',
        path: '/app/management/kibana/settings',
        showOnHomePage: false,
        category: 'admin',
      });
    }

    return {
      ...sectionRegistrySetup,
    };
  }

  public start() {
    return {
      ...sectionRegistryStart,
    };
  }
}
