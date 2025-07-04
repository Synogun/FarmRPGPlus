
/**
 * Utility class for logging messages to the console with a timestamp and a custom prefix.
 * Provides static methods for different log levels: debug, info, log, warn, and error.
 *
 * @class
 */
class ConsolePlus {
    static prefix = () => `[${this._timestamp()}] [FRPGP]`;

    /**
     * Returns the current date and time as a formatted string.
     * @private
     * @returns {string} The current date and time formatted according to the user's locale.
     */
    static _timestamp() {
        return (new Date).toLocaleString();
    }

    /**
     * Logs debug messages to the console with a timestamp and a custom prefix.
     *
     * @static
     * @param {...any} args - The messages or objects to log.
     */
    static debug(...args) {
        if (process.env.NODE_ENV === 'production') {
            return; // Skip debug logs in production
        }
        console.debug(`${this.prefix()}`, ...args);
    }

    /**
     * Logs informational messages to the console with a timestamp and a custom prefix.
     *
     * @static
     * @param {...any} args - The messages or objects to log.
     */
    static info(...args) {
        console.info(`${this.prefix()}`, ...args);
    }

    /**
     * Logs messages to the console with a timestamp and a custom prefix.
     *
     * @static
     * @param {...any} args - The messages or objects to log.
     */
    static log(...args) {
        console.log(`${this.prefix()}`, ...args);
    }

    /**
     * Logs a warning message to the console with a timestamp and a custom prefix.
     *
     * @static
     * @param {...any} args - The warning messages or objects to log.
     */
    static warn(...args) {
        console.warn(`${this.prefix()}`, ...args);
    }

    /**
     * Logs an error message to the console with a timestamp and a custom prefix.
     *
     * @static
     * @param {...any} args - The error messages or objects to log.
     */
    static error(...args) {
        console.error(`${this.prefix()}`, ...args);
    }
}

export default ConsolePlus;
