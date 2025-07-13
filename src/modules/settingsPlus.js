import ConsolePlus from './consolePlus';
import StoragePlus from './storagePlus';

class SettingsPlus {
    static _configKey = 'feature_configs';

    /**
     * Registers a new settings page with the given page ID and options.
     *
     * @param {string} pageId - The unique identifier for the settings page.
     * @param {Object} options - Options for the settings page.
     * @param {string} options.displayName - The display name for the settings page.
     * @param {number} [options.order=100] - The order in which the page should appear.
     */
    static registerPage(pageId, { displayName, order = 100 }) {
        if (!pageId) {
            ConsolePlus.warn('Invalid page registration:', { pageId });
            return;
        }

        const itExists = StoragePlus.get(`${SettingsPlus._configKey}.${pageId}`, null);
        if (!itExists) {
            StoragePlus.set(`${SettingsPlus._configKey}.${pageId}`, {
                title: displayName ?? pageId,
                order,
                features: {},
            });
        }
    }

    /**
     *  Register a feature config for a specific page
     *
     *  @param {string} pageId - The ID of the page to register the config on
     *  @param {string} featureId - The ID of the config to register
     *  @param {*} featureObject - Configuration object for the config
     *  @returns {void}
     */
    static registerFeature(pageId, featureId, featureObject) {
        if (!featureObject || !pageId || !featureId) {
            ConsolePlus.warn('Invalid config registration:', { pageId, configId: featureId });
            return;
        }

        let key = `${SettingsPlus._configKey}.${pageId}`;

        if (!StoragePlus.get(key, null)) {
            ConsolePlus.warn('Page not registered:', pageId);
            return;
        }

        key += `.features.${featureId}`;

        const itExists = StoragePlus.get(key, null);
        if (!itExists) {
            if (featureObject.configs && Object.keys(featureObject.configs).length > 0) {
                for (const [configId, configDef] of Object.entries(featureObject.configs)) {
                    if (configDef.enables && !Array.isArray(configDef.enables)) {
                        ConsolePlus.warn('Invalid enables for config:', { pageId, featureId, configId });
                        delete configDef.enables;
                    }

                    for (const enable of configDef.enables ?? []) {
                        if (!featureObject.configs[enable]) {
                            ConsolePlus.warn('Enable config not found:', { pageId, featureId, configId, enable });
                            configDef.enables = configDef.enables.filter(e => e !== enable);
                            continue;
                        }

                        if (!featureObject.configs[enable].dependencies) {
                            featureObject.configs[enable].dependencies = [];
                        }
                        if (!featureObject.configs[enable].dependencies.includes(featureId)) {
                            featureObject.configs[enable].dependencies.push(featureId);
                        }
                        if (!featureObject.configs[enable].dependencies.includes(configId)) {
                            featureObject.configs[enable].dependencies.push(configId);
                        }
                    }

                    if (configId !== featureId) {
                        if (!featureObject.configs[configId].dependencies) {
                            featureObject.configs[configId].dependencies = [];
                        }
                        if (!featureObject.configs[configId].dependencies.includes(featureId)) {
                            featureObject.configs[configId].dependencies.push(featureId);
                        }
                    }
                }
            }
            StoragePlus.set(key, featureObject);
        }

        return;
    }

    /**
     * Get all registered pages with their configurations
     *
     * @returns {Array} - Array of page configurations
     */
    static getAllFeatures() {
        const settings = StoragePlus.get(SettingsPlus._configKey, {});
        ConsolePlus.debug('All registered features:', settings);

        const result = Object.entries(settings)
            .filter(([_, pageDef]) => Object.entries(pageDef.features).length > 0)
            .sort(([_a, aPageDef], [_b, bPageDef]) => aPageDef.order - bPageDef.order)
            .map(([pageId, pageDef]) => ({
                pageId,
                ...pageDef,
                features: Object.entries(pageDef?.features ?? {})
                    .map(([featureId, featureDef]) => ({
                        featureId,
                        ...featureDef,
                        configs: Object.entries(featureDef.configs)
                            .map(([configId, configDef]) => ({
                                configId,
                                ...configDef,
                            })),
                    })),
            }));

        ConsolePlus.debug('Filtered and sorted features:', result);
        return result;
    }

    /**
     * Check if a feature is enabled
     *
     * @param {string} pageId - The ID of the page
     * @param {string} featureId - The ID of the configuration to check
     * @returns {boolean} - True if the feature is enabled, false otherwise
     */
    static isEnabled(pageId, featureId) {
        if (!pageId || !featureId) {
            ConsolePlus.warn('Invalid parameters for isEnabled:', { pageId, featureId });
            return false;
        }

        const feature = StoragePlus.get(
            SettingsPlus._configKey +
            `.${pageId}.features.${featureId}`,
            { isEnabled: true }
        );

        return feature.isEnabled;
    }

    /**
     * Sets a feature or configuration value.
     * This can be used to enable/disable a feature or set a value for a configuration.
     *
     * @param {string} pageId - The ID of the page
     * @param {string} featureId - The ID of the feature
     * @param {string} configId - Optional configuration ID
     * @param {*} value - The value to set for the configuration
     * @returns {boolean} - True if the value was set successfully, false otherwise
     */
    static setValue(pageId, featureId, configId = undefined, value) {
        if (!pageId || !featureId || value === undefined) {
            ConsolePlus.warn('Invalid parameters for setValue:', { pageId, featureId, value });
            return false;
        }

        const key = `${SettingsPlus._configKey}.${pageId}.features.${featureId}`;
        const feature = StoragePlus.get(key, {});

        if (!feature) {
            ConsolePlus.warn('Feature not found for:', { pageId, featureId });
            return false;
        }

        if (configId) {
            if (!feature.configs || !feature.configs[configId]) {
                ConsolePlus.warn('Config not found:', { pageId, featureId, configId });
                return false;
            }
            feature.configs[configId].typeData.value = value;
        } else {
            feature.isEnabled = value;
        }

        StoragePlus.set(key, feature);

        return true;
    }

    /**
     * Get configuration value.
     * This can be used to retrieve the value of a feature or a sub-configuration.
     *
     * @param {string} pageId - The ID of the page
     * @param {string} featureId - The ID of the feature
     * @param {string} configId - Optional configuration ID
     * @param {*} defaultValue - Default value to return if not found
     * @returns {*} - The value of the configuration or feature, or defaultValue if not found
     */
    static getValue(pageId, featureId, configId = undefined, defaultValue = undefined) {
        if (!pageId || !featureId) {
            ConsolePlus.warn('Invalid parameters for getValue:', { pageId, featureId });
            return null;
        }

        let key = `${SettingsPlus._configKey}.${pageId}.features.${featureId}`;
        const feature = StoragePlus.get(key, null);
        let value = defaultValue;

        if (!feature) {
            ConsolePlus.warn('Feature not found for:', { pageId, featureId, configId });
            return null;
        }

        if (configId) {
            if (!feature.configs || !feature.configs[configId]) {
                ConsolePlus.warn('Config not found:', { pageId, featureId, configId });
                return null;
            }
            value = feature.configs[configId].typeData.value;
        } else {
            value = feature?.isEnabled ?? value;
        }

        if (value === undefined || value === null) {
            ConsolePlus.warn('Settings not found for:', { pageId, featureId, configId });
            return null;
        }

        return value;
    }
}

export default SettingsPlus;
