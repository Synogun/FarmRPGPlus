/**
 * StoragePlus is a wrapper class for managing a custom localStorage namespace (`frpg_plus`).
 * It provides methods to set, get, remove, and clear key-value pairs stored as a JSON object in localStorage.
 *
 * @class
 */
class StoragePlus {
    /**
     * Initializes the StoragePlus module.
     * Ensures that a 'frpg_plus' key exists in localStorage and parses its value into the instance's storage property.
     * If the key does not exist, it is created and initialized as an empty object.
     */
    constructor() {
        if (!window.localStorage?.frpg_plus) {
            window.localStorage.setItem('frpg_plus', JSON.stringify({}));
        }

        this.storage = window.localStorage.frpg_plus
            ? JSON.parse(window.localStorage.frpg_plus)
            : {};
    }

    /**
     * Sets a value for the specified key in the storage object and persists the updated storage to localStorage.
     *
     * @param {string} key - The key under which the value will be stored.
     * @param {*} value - The value to store. Can be of any type that is serializable to JSON.
     */
    set(key, value) {
        this.storage[key] = value;
        window.localStorage.setItem('frpg_plus', JSON.stringify(this.storage));
    }

    /**
     * Retrieves the value associated with the specified key from storage.
     *
     * @param {string} key - The key of the item to retrieve.
     * @param {*} [defaultValue=undefined] - The default value to return if the key does not exist in storage.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    get(key, defaultValue) {
        const value = this.storage[key];
        return value !== undefined ? value : defaultValue;
    }

    /**
     * Removes an item from the internal storage and updates localStorage.
     *
     * @param {string} key - The key of the item to remove from storage.
     */
    remove(key) {
        delete this.storage[key];
        window.localStorage.setItem('frpg_plus', JSON.stringify(this.storage));
    }

    /**
     * Clears the current storage by resetting it to an empty object
     * and updates the 'frpg_plus' entry in localStorage accordingly.
     */
    clear() {
        this.storage = {};
        window.localStorage.setItem('frpg_plus', JSON.stringify(this.storage));
    }
}

export default new StoragePlus;
