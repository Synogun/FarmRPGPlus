import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import GamePagesEnum from '../constants/gamePagesEnum';
import { isUrlValid } from '../utils/utils';
import ConsolePlus from './consolePlus';

/**
 * RouterPlus is a utility for handling page navigation and routing.
 * @namespace RouterPlus
 * @property {Object} Page - Predefined page names.
 * @property {Object} handlers - Registered page handlers.
 * @property {function} register - Register a handler for a page.
 * @property {function} unregister - Unregister a handler for a page.
 * @property {function} isRegistered - Check if a handler is registered for a page.
 * @property {function} handle - Call the registered handler for a page.
 * @property {function} getPageUrl - Get the URL of a page.
 * @property {function} getPageName - Get the name of a page.
 * @property {function} getPreviousPage - Get the previous page object.
 * @property {function} getPreviousSide - Get the navigation side.
 * @property {function} handlePageChange - Handle navigation or update for a page.
 * @property {function} getPageHistory - Get navigation history from a page.
 */
const RouterPlus = {
    /**
     * Predefined page names.
     * @readonly
     * @enum {string}
     */
    Pages: Object.freeze({ ...GamePagesEnum }),

    /**
     * Stores registered page handlers.
     * @private
     * @type {Object<string, Function>}
     */
    handlers: {},

    /**
     * Fixes the URL hash if needed.
     */
    fixUrlHash: function () {
        // common mistakes in URL structure
        // https://farmrpg.com/
        // https://farmrpg.com/<page-name>.php
        // https://farmrpg.com/<page-name>.php#!/<page-name>.php
        // https://farmrpg.com/<page-name>.php
        // https://farmrpg.com/#!/https://farmrpg.com/<page-name>.php

        const { location } = window;
        const baseUrl = 'https://farmrpg.com/';
        const phpPageRegex = /^https:\/\/farmrpg\.com\/([^/]+\.php)(\?.*)?$/;
        const hashPhpRegex = /^#!\/([^/]+\.php)(\?.*)?$/;

        // Case 0: https://farmrpg.com/
        if (location.href === baseUrl || location.href === baseUrl.replace(/\/$/, '')) {
            location.replace(`${baseUrl}#!/index.php`);
            return;
        }

        // Case 1: https://farmrpg.com/<page-name>.php
        if (phpPageRegex.test(location.href) && !location.hash) {
            const match = location.href.match(phpPageRegex);
            const page = match[1] + (match[2] || '');
            location.replace(`${baseUrl}#!/${page}`);
            return;
        }

        // Case 2: https://farmrpg.com/<page-name>.php#!/<page-name>.php
        if (phpPageRegex.test(location.href) && location.hash && hashPhpRegex.test(location.hash)) {
            const match = location.hash.match(hashPhpRegex);
            const page = match[1] + (match[2] || '');
            location.replace(`${baseUrl}#!/${page}`);
            return;
        }

        // Case 3: https://farmrpg.com/#!/https://farmrpg.com/<page-name>.php
        if (
            location.hash &&
            /^#!\/https:\/\/farmrpg\.com\/([^/]+\.php)(\?.*)?$/.test(location.hash)
        ) {
            const match = location.hash.match(/^#!\/https:\/\/farmrpg\.com\/([^/]+\.php)(\?.*)?$/);
            const page = match[1] + (match[2] || '');
            location.replace(`${baseUrl}#!/${page}`);
            return;
        }

        if (this.isFarmUrlValid(location.href)) {
            ConsolePlus.debug('URL is valid, no changes needed.');
            return;
        }
    },

    fixBackButton: function (page) {
        if (!page?.navbarInnerContainer) {
            ConsolePlus.warn('No back button to fix, page does not have a navbar.');
            return;
        }

        const previousPage = this.getPreviousPage(page);

        if (!previousPage || !this.getPageName(previousPage)) {
            ConsolePlus.warn('No valid previous page found to fix back button.');
            return;
        }

        const $backButton = $(page.navbarInnerContainer).find('a.back[href="x"]');
        
        if (!$backButton.length) {
            return;
        }

        const previousPageUrl = this.getPageName(previousPage) === this.Pages.INDEX
            ? 'index.php'
            : this.getPageUrl(previousPage);

        if (!previousPageUrl) {
            return;
        }

        $backButton.attr('href', previousPageUrl);

        $backButton.removeClass('back');
        $backButton.addClass('no-animation');

        ConsolePlus.log(`Back button fixed to: ${previousPageUrl}`);
    },
    
    /**
     * Register a handler for a page.
     * @param {string} page - Page name.
     * @param {Function} handler - Handler for navigation.
     */
    register: function (page, handler) {
        if (
            typeof page !== 'string' ||
            !page.trim() ||
            typeof handler !== 'function'
        ) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.register.name,
            );
        }

        this.handlers[page] = handler;
    },

    /**
     * Unregister a handler for a page.
     * @param {string} page - Page name.
     */
    unregister: function (page) {
        delete this.handlers[page];
    },

    /**
     * Check if a handler is registered for a page.
     * @param {string} page - Page name.
     * @returns {boolean}
     */
    isRegistered: function (page) {
        return !!this.handlers[page];
    },

    /**
     * Check if the navigation is a page update.
     * @param {Object} page - Page object.
     * @returns {boolean}
     */
    isPageUpdate: function (page) {
        const pageName = this.getPageName(page);
        const lastPage = this.getPreviousPage(page);
        return lastPage && this.getPageName(lastPage) === pageName;
    },

    /**
     * Get the URL of a page.
     * @param {Object} page - Page object.
     * @returns {string}
     */
    getPageUrl: function (page) {
        return page?.url ?? '';
    },

    /**
     * Get the name of a page.
     * @param {Object} page - Page object.
     * @returns {string|undefined}
     */
    getPageName: function (page) {
        return page?.name ?? undefined;
    },

    /**
     * Get the previous page object.
     * @param {Object} page - Current page object.
     * @returns {Object|undefined}
     */
    getPreviousPage: function (page) {
        return page?.fromPage ?? undefined;
    },

    /**
     * Get the navigation side.
     * @param {Object} page - Current page object.
     * @returns {string|undefined}
     */
    getPreviousSide: function (page) {
        return page?.from ?? undefined;
    },

    /**
     * Handle navigation or update for a page.
     * @param {Object} page - Page object.
     */
    handlePageChange: function (page) {
        if (!page) { return; }
        
        const pageName = this.getPageName(page);

        if (this.isRegistered(pageName) && this.handlers[pageName]) {
            this.handlers[pageName](page);
        } else {
            ConsolePlus.warn(`No handler registered for page: ${pageName}`, page);
        }
    },

    /**
     * Get navigation history from a page.
     * @param {Object} page - Current page object.
     * @param {number} [maximum] - Max number of history entries.
     * @returns {Array<Object>}
     */
    getPageHistory: function (page, maximum = undefined) {
        if (!page) { return []; }

        const history = [];
        let currentPage = page;

        while (currentPage) {
            this.getPageName(currentPage) && history.push({
                from: currentPage.from || 'unknown',
                name: this.getPageName(currentPage) || 'unknown',
            });
            
            if (maximum && history.length >= maximum) { break; }
            currentPage = this.getPreviousPage(currentPage);
        }
        return history;
    },

    isFarmUrlValid: function (url) {
        return isUrlValid(url) && /^https:\/\/farmrpg\.com\/#!\/[^/]+\.php(\?.*)?$/.test(url);
    },

    isHashValid: function (hash) {
        const isHashValid = hash => /^#!\/[^/]+\.php(\?.*)?$/.test(hash);
        return isHashValid(hash);
    }
};

export default RouterPlus;

