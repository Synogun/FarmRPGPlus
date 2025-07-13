/**
 * StoragePlus is a wrapper class for managing a custom localStorage namespace (`frpg_plus`).
 * It provides static methods to set, get, remove, and clear key-value pairs stored as a JSON object in localStorage.
 *
 * @class
 */
class StoragePlus {
    static _configKey = process.env.NODE_ENV === 'production' ? 'frpg_plus' : 'frpg_plus_dev';

    /**
     * Ensures that a 'frpg_plus' key exists in localStorage and returns the parsed object.
     * If the key does not exist, it is created and initialized as an empty object.
     * @returns {Object} The parsed storage object.
     */
    static _getStorage() {
        const storedValue = window.localStorage.getItem(StoragePlus._configKey);
        if (!storedValue) {
            StoragePlus._setStorage({});
            return {};
        }
        try {
            return JSON.parse(storedValue);
        } catch (e) {
            console.error('Error parsing stored settings:', e);
            return {};
        }
    }

    /**
     * Persists the given storage object to localStorage.
     * @param {Object} storage - The storage object to persist.
     */
    static _setStorage(storage) {
        window.localStorage.setItem(StoragePlus._configKey, JSON.stringify(storage));
    }

    /**
     * Sets a value for the specified key in the storage object and persists the updated storage to localStorage
     *
     * @param {string} key - The key under which the value will be stored, using dot notation for nested properties.
     * @param {*} value - The value to store. Can be of any type that is serializable to JSON.
     */
    static set(key, value) {
        const keys = key.split('.');
        const storage = StoragePlus._getStorage();
        let current = storage;
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (i === keys.length - 1) {
                current[k] = value;
            } else {
                if (!current[k] || typeof current[k] !== 'object') {
                    current[k] = {};
                }
                current = current[k];
            }
        }
        StoragePlus._setStorage(storage);
    }

    /**
     * Retrieves the value associated with the specified key from storage.
     *
     * @param {string} key - The key of the item to retrieve using dot notation for nested properties.
     * @param {*} [defaultValue=undefined] - The default value to return if the key does not exist in storage.
     * @returns {*} The value associated with the key, or defaultValue if the key does not exist.
     */
    static get(key, defaultValue) {
        const keys = key.split('.');
        let value = StoragePlus._getStorage();
        for (const k of keys) {
            if (value && Object.prototype.hasOwnProperty.call(value, k)) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        return value;
    }

    /**
     * Removes an item from the internal storage and updates localStorage.
     *
     * @param {string} key - The key of the item to remove from storage, using dot notation for nested properties.
     * @returns {void}
     */
    static remove(key) {
        const keys = key.split('.');
        const storage = StoragePlus._getStorage();
        let current = storage;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k] || typeof current[k] !== 'object') {
                return;
            }
            current = current[k];
        }
        delete current[keys[keys.length - 1]];
        StoragePlus._setStorage(storage);
    }

    /**
     * Clears the current storage by resetting it to an empty object
     * and updates the 'frpg_plus' entry in localStorage accordingly.
     */
    static clear() {
        StoragePlus._setStorage({});
    }
}

export default StoragePlus;
