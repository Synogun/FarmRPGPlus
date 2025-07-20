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

        const registeredPage = StoragePlus.get(`${SettingsPlus._configKey}.${pageId}`, null);
        
        if (!registeredPage) {
            StoragePlus.set(`${SettingsPlus._configKey}.${pageId}`, {
                title: displayName ?? pageId,
                order,
                features: {},
            });
            return;
        }

        StoragePlus.set(`${SettingsPlus._configKey}.${pageId}`, {
            ...registeredPage,
            ...displayName ? { title: displayName } : {},
            ...order ? { order } : {},
        });
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
        if (!pageId || !featureId || !featureObject) {
            ConsolePlus.warn('Invalid config registration:', { pageId, featureId });
            return;
        }

        let key = `${SettingsPlus._configKey}.${pageId}`;

        if (!StoragePlus.get(key, null)) {
            ConsolePlus.warn('Page not registered:', pageId);
            return;
        }

        key += `.features.${featureId}`;

        const registeredFeature = StoragePlus.get(key, null);
        if (!registeredFeature) {
            if (!featureObject.isEnabled &&
                featureObject.enabledByDefault !== undefined) {
                featureObject.isEnabled = featureObject.enabledByDefault;
            }
            
            if (featureObject.configs) {
                Object.values(featureObject.configs).forEach((config) => {
                    if (config?.typeData?.value === undefined &&
                        config?.typeData?.defaultValue !== undefined) {
                        config.typeData.value = config.typeData.defaultValue;
                    }
                });
            }

            StoragePlus.set(key, featureObject);
            return;
        }

        const mergedFeature = {
            ...registeredFeature,
            ...featureObject,
        };

        if (registeredFeature.isEnabled !== undefined) {
            mergedFeature.isEnabled = registeredFeature.isEnabled;
        } else if (featureObject.enabledByDefault !== undefined) {
            mergedFeature.isEnabled = featureObject.enabledByDefault;
        }

        mergedFeature.configs = {
            ...registeredFeature.configs,
            ...featureObject.configs
        };

        for (const configId of Object.keys(mergedFeature.configs)) {
            if (registeredFeature.configs[configId] && !featureObject.configs[configId]) {
                mergedFeature.configs[configId].old = true;
            }

            const regConfig = registeredFeature.configs?.[configId];
            const newConfig = featureObject.configs?.[configId];

            if (!regConfig) {
                if (newConfig?.typeData?.value === undefined &&
                    newConfig?.typeData?.defaultValue !== undefined) {
                    mergedFeature.configs[configId].typeData.value = newConfig.typeData.defaultValue;
                }
            } else if (newConfig) {
                if (regConfig.type !== newConfig.type) {
                    if (newConfig.typeData?.defaultValue !== undefined) {
                        mergedFeature.configs[configId].typeData.value = newConfig.typeData.defaultValue;
                    }
                } else if (regConfig.typeData?.value !== undefined) {
                    mergedFeature.configs[configId].typeData.value = regConfig.typeData.value;
                }
            }
        }

        StoragePlus.set(key, mergedFeature);

        return;
    }

    /**
     * Get all registered pages with their configurations
     *
     * @returns {Array} - Array of page configurations
     */
    static getAllFeatures() {
        const features = StoragePlus.get(SettingsPlus._configKey, {});

        return Object.entries(features)
            .filter(([_, pageDef]) => Object.entries(pageDef.features).length > 0)
            .sort(([_a, aPageDef], [_b, bPageDef]) => aPageDef.order - bPageDef.order)
            .map(([pageId, pageDef]) => ({
                pageId,
                ...pageDef,
                features: Object.entries(pageDef?.features ?? {})
                    .map(([featureId, featureDef]) => ({
                        featureId,
                        ...featureDef,
                        configs: Object.entries(featureDef?.configs ?? {})
                            .map(([configId, configDef]) => ({
                                configId,
                                ...configDef,
                            })),
                    })),
            }));
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
            null
        );

        if (!feature) {
            return false;
        }

        if (feature.isEnabled === undefined) {
            return feature.enabledByDefault !== undefined ? feature.enabledByDefault : false;
        }

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
            if (!feature.configs || !feature.configs[configId] || feature.configs[configId].old === true) {
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

    static resetAllSettings() {
        StoragePlus.set(SettingsPlus._configKey, {});
        ConsolePlus.log('All settings have been reset to default.');
        
    }
}

export default SettingsPlus;
