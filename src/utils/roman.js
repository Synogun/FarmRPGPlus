/**
 * Utility class for working with Roman numerals.
 *
 * Provides static methods to validate, convert, and manipulate Roman numerals.
 *
 * @class Roman
 *
 * @example
 * Roman.isValid('XIV'); // true
 * Roman.romanize(14); // 'XIV'
 * Roman.deromanize('XIV'); // 14
 * Roman.next('XIV'); // 'XV'
 * Roman.prev('XIV'); // 'XIII'
 */
class Roman {

    /**
     * Determines whether a given string is a valid Roman numeral.
     *
     * @param {string} str - The string to test for Roman numeral validity.
     * @returns {boolean} True if the string is a valid Roman numeral, false otherwise.
     */
    static isValid(str) {
        // https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
        if (typeof str !== 'string' || !str.trim()) {
            return false;
        }

        return /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str.toUpperCase());
    }

    /**
     * Converts an integer to its Roman numeral representation.
     *
     * @param {number|string} num - The number to convert to a Roman numeral.
     * @returns {string|boolean} The Roman numeral as a string, or false if input is invalid.
     */
    static romanize(num) {
        // https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
        if (!+num) {
            return false;
        }

        const digits = String(+num).split('');
        const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

        let roman = '';
        let i = 3;
        
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || '') + roman;
        }

        return Array(+digits.join('') + 1).join('M') + roman;
    }

    /**
     * Converts a Roman numeral string to its integer value.
     *
     * @param {string} str - The Roman numeral string to convert.
     * @returns {number|false} The integer value of the Roman numeral, or false if the input is invalid.
     */
    static deromanize(str) {
        // https://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
        if (typeof str !== 'string' || !str.trim()) {
            return false;
        }

        str = str.toUpperCase();
        
        const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
        const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
        
        const key = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        
        let num = 0;
        let m;

        if (!(str && validator.test(str))) {
            return false;
        }

        m = token.exec(str);
        while (m) {
            num += key[m[0]];
            m = token.exec(str);
        }

        return num;
    }

    /**
     * Returns the next Roman numeral after the given Roman numeral string.
     * If the input is not a valid Roman numeral, returns null.
     *
     * @param {string} str - The Roman numeral string to increment.
     * @returns {string|null} The next Roman numeral string, or null if input is invalid.
     */
    static next(str) {
        if (typeof str !== 'string' || !str.trim() || !Roman.isValid(str)) {
            return null;
        }

        let n = Roman.deromanize(str);

        return Roman.romanize(n + 1);
    }

    /**
     * Returns the previous Roman numeral string for the given Roman numeral.
     * If the input is not a valid Roman numeral or represents 1 or less, returns null.
     *
     * @param {string} str - The Roman numeral string to decrement.
     * @returns {string|null} The previous Roman numeral string, or null if not applicable.
     */
    static prev(str) {
        if (typeof str !== 'string' || !str.trim() || !Roman.isValid(str)) {
            return null;
        }

        let n = Roman.deromanize(str);

        if (n <= 1) {
            return null;
        }

        return Roman.romanize(n - 1);
    }
}

export default Roman;

