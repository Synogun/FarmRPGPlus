import $ from 'jquery';
import ConsolePlus from './modules/consolePlus';
import DebugPlus from './modules/debugPlus';
import RouterPlus from './modules/routerPlus';
import Pages from './pages/index';
import TimeControl from './utils/timeControl';

// Registering page handlers
RouterPlus.registerHandlers(Pages);

(function () {
    'use strict';
    $(function () {

        const isReset = TimeControl.isResetTime();
        if (isReset === 1) {
            ConsolePlus.warn('It is backup time, not loading the app.');
            return;
        } else if (isReset === 2) {
            ConsolePlus.warn('It is reset time, not loading the app.');
            return;
        }
        
        ConsolePlus.log('FarmRPGPlus app initialized.');

        if (DebugPlus.isDevelopmentMode()) {
            ConsolePlus.warn('Development mode is enabled, debugging features are active.');
            DebugPlus.applyDebugFeatures();
        }

        RouterPlus.fixUrlHash();

        if (window.mainView && mainView.container) {
            $(mainView.container).on('page:init page:reinit', function () {
                RouterPlus.fixUrlHash();

                const page = myApp.getCurrentView().activePage || mainView.activePage;

                const callback = RouterPlus.handlePageChange(page);

                if (callback && typeof callback === 'function') {
                    callback(page);
                } else {
                    ConsolePlus.debug('No callback found for the current page:', page.name);
                }
            });
        }
    });
})();
