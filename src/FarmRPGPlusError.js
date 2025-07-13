import ConsolePlus from './modules/consolePlus';

const ErrorTypes = Object.freeze({
    PAGE_NOT_FOUND: 'Page not found',
    PARAMETER_MISMATCH: 'Parameter type mismatch',
    ELEMENT_NOT_FOUND: 'Element not found',
    NETWORK_ERROR: 'Network error',
    INVALID_QUEST_NUMBER: 'Invalid quest number',
    INVALID_URL: 'Invalid URL',
    UNKNOWN: 'Unknown error',
});

class FarmRPGPlusError extends Error {
    constructor(type, context = '', extraMessage = '') {
        super(type || ErrorTypes.UNKNOWN);
        this.context = context ? ` | ${context}` : '';
        this.extraMessage = extraMessage ? ` | ${extraMessage}` : '';

        ConsolePlus.error(`Error: ${this.message}${this.context}${this.extraMessage}`);
    }
}

export {
    ErrorTypes as ErrorTypesEnum,
    FarmRPGPlusError
};

