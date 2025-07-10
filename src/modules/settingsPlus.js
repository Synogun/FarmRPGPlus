import ConsolePlus from './consolePlus';
import StoragePlus from './storagePlus';

class SettingsPlus {
    static _configKey = 'feature_configs';

    /**
     * Register a feature config for a specific page
     *
     * @param {string} pageId - The ID of the page to register the config on
     * @param {string} configId - The ID of the config to register
     * @param {Object} config - Configuration object for the config
     * @returns {void}
     * @throws {Error} If the featureObject is invalid
     */
    static registerFeature(featureObject) {
      if (!featureObject || !featureObject.pageId || !featureObject.configId) {
        ConsolePlus.warn('Invalid config registration:', { pageId, configId });
        return;
      }
        /* featureObject template 
            {
                pageId: String,
                order: Number,
                configId: String,
                title: String,
                subtitle: String,
                isEnabled: Boolean,
                configs: {}, // Additional configurations if needed
            }

        extra config template:
            configs: {
                subConfigId: {
                    subConfigId: String,
                    title: String,
                    subtitle: String,
                    type: 'checkbox' | 'select' | 'numeric', // Type of the config
                    typeData: { // Additional data for the type
                        options: Array, // For select type
                        value: any, // Current value for input or checkbox or selected option
                        max: Number, // For numeric type
                        min: Number,  // For numeric type
                    }
                }
            }
        */

        let key = `${SettingsPlus._configKey}.${featureObject.pageId}`;
      
        if (!StoragePlus.get(`${key}`, null)) {
            StoragePlus.set(`${key}`, {
                order: featureObject.order || 100,
                configs: {},
            });
        }

        key += `.configs.${featureObject.configId}`;

        const itExists = StoragePlus.get(key, null);
        if (!itExists) {
            delete featureObject.pageId;
            delete featureObject.order;
            featureObject.isEnabled = featureObject.isEnabled ?? true;

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
            .filter(([_, pageDef]) => Object.entries(pageDef.configs).length > 0)
            .sort(([_a, aPageDef], [_b, bPageDef]) => aPageDef.order - bPageDef.order)
            .map(([pageId, pageDef]) => ({ pageId, ...pageDef }));

        ConsolePlus.debug('Filtered and sorted features:', result);
        return result;
    }

    /**
     * Check if a feature is enabled
     * 
     * @param {string} pageId - The ID of the page
     * @param {string} configId - The ID of the configuration to check
     * @returns {boolean} - True if the feature is enabled, false otherwise
     */
    static isEnabled(pageId, configId) {
        if( !pageId || !configId ) {
            ConsolePlus.warn('Invalid parameters for isEnabled:', { pageId, configId });
            return false;
        }

        const config = StoragePlus.get(
            SettingsPlus._configKey + 
            `.${pageId}.configs.${configId}`,
            { isEnabled: true }
        );

        return config.isEnabled;
    }

    /**
     * Sets configuration value.
     * This can be used to enable/disable a feature or set a value for a sub-configuration.
     * 
     * @param {string} pageId - The ID of the page
     * @param {string} configId - The ID of the configuration
     * @param {string} subconfigId - Optional sub-configuration ID
     * @param {*} value - The value to set for the configuration
     * @returns {boolean} - True if the value was set successfully, false otherwise
     */
    static setValue(pageId, configId, subconfigId = undefined, value) {
        if (!pageId || !configId || value === undefined) {
            ConsolePlus.warn('Invalid parameters for setValue:', { pageId, configId, value });
            return false;
        }

        const key = `${SettingsPlus._configKey}.${pageId}.configs.${configId}`;
        const settings = StoragePlus.get(key, {});

        if (!settings) {
            ConsolePlus.warn('Settings not found for:', { pageId, configId });
            return false;
        }

        if (subconfigId) {
            if (!settings.configs || !settings.configs[subconfigId]) {
                ConsolePlus.warn('Subconfig not found:', { pageId, configId, subconfigId });
                return false;
            }
            settings.configs[subconfigId].typeData.value = value;
        } else {
            settings.isEnabled = value;
        }

        StoragePlus.set(key, settings);

        return true;
    }

    /**
     * Get configuration value.
     * This can be used to retrieve the value of a feature or a sub-configuration.
     * 
     * @param {string} pageId - The ID of the page
     * @param {string} configId - The ID of the configuration
     * @param {string} subconfigId - Optional sub-configuration ID
     * @param {*} defaultValue - Default value to return if not found
     * @returns {*} - The value of the configuration, or null if not found
     */
    static getValue(pageId, configId, subconfigId = undefined, defaultValue = undefined) {
        if (!pageId || !configId) {
            ConsolePlus.warn('Invalid parameters for getValue:', { pageId, configId });
            return null;
        }

        let key = `${SettingsPlus._configKey}.${pageId}.configs.${configId}`;

        if (subconfigId) {
            key += `.${subconfigId}.typeData.value`;
        } else {
            key += '.isEnabled';
        }

        const value = StoragePlus.get(key, defaultValue);

        if (!value) {
            ConsolePlus.warn('Settings not found for:', { pageId, configId });
            return null;
        }

        return value;
    }
}

export default SettingsPlus;

/* Example config with no additional options
  <li>
    <div class="item-content">
      <div class="item-inner" role="checkbox" id="subconfigId-aria" aria-labelledby="subconfigId-label" aria-checked="false">
        <div class="item-title label" style="width:60%">
          <label id="subconfigId-label" for="subconfigId-input">subconfig title goes here</label>
          <br>
          <span style="font-size: 11px">subconfig subtitle goes here</span>
        </div>
        <label class="label-switch">
          <input type="checkbox" class="frpgp-options" id="subconfigId-input" name="subconfigId-name" value="1">
          <div class="checkbox"></div>
        </label>
      </div>
    </div>
  </li>
*/

/* Example config with additional options
<li class="accordion-item">
  <a href="#" class="item-content item-link">
    <div class="item-inner">
      <div class="item-title">
        config title goes here
        <br>
        <span style="font-size: 11px">config subtitle goes here</span>
      </div>
    </div>
  </a>
  <div class="accordion-item-content" style="">
    <div style="" class="list-block">
      <ul>
        <li>
          <div class="item-content">
            <div class="item-inner" role="checkbox" id="subconfigId-aria" aria-labelledby="subconfigId-label" aria-checked="false">
              <div class="item-title label" style="width:60%">
                <label id="subconfigId-label" for="subconfigId-input">subconfig title goes here</label>
                <br>
                <span style="font-size: 11px">subconfig subtitle goes here</span>
              </div>
              <label class="label-switch">
                <input type="checkbox" class="frpgp-options" id="subconfigId-input" name="subconfigId-name" value="1">
                <div class="checkbox"></div>
              </label>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</li>
*/
