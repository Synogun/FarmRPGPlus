
class FarmRPGPlusError extends Error {
    constructor(type, context = '') {
        super(ErrorTypes[type] || ErrorTypes.UNKNOWN);
        this.name = 'FarmRPGPlusError';
        this.context = ` - ${context}`;
        this.timestamp = (new Date).toLocaleString();
        this.type = type;

        console.error(this.toString());
    }

    toString = () =>
        `[${this.timestamp}] ${this.name}${this.context}: ${this.message}`;
}

const ErrorTypes = Object.freeze({
    PAGE_NOT_FOUND: 'Page not found',
    PARAMETER_MISMATCH: 'Parameter type mismatch',
    ELEMENT_NOT_FOUND: 'Element not found',
    NETWORK_ERROR: 'Network error',
    INVALID_QUEST_NUMBER: 'Invalid quest number',
    INVALID_URL: 'Invalid URL',
    UNKNOWN: 'Unknown error',
});

export {
    ErrorTypes as ErrorTypesEnum,
    FarmRPGPlusError
};

