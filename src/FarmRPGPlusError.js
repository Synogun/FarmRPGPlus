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
        super(`Error: ${type || ErrorTypes.UNKNOWN}${context && ' | ' + context}${extraMessage ? ' | ' + extraMessage : ''}`);
        this.name = 'FarmRPGPlusError';
    }
}

const throwIfPageInvalid = (page, context = '') => {
    if (!page || !page.container) {
        throw new FarmRPGPlusError(
            ErrorTypes.PAGE_NOT_FOUND,
            context,
            `Page object is invalid or missing container: ${JSON.stringify(page)}`
        );
    }
};

export {
    ErrorTypes as ErrorTypesEnum,
    FarmRPGPlusError,
    throwIfPageInvalid
};

