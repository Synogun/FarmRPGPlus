import $ from 'jquery';
import ConsolePlus from './modules/consolePlus';
import DebugPlus from './modules/debugPlus';
import RouterPlus from './modules/routerPlus';
import Pages from './pages/index';
import { isResetTime } from './utils/utils';

// Registering page handlers
RouterPlus.registerHandles(Pages);

(function () {
    'use strict';
    $(function () {
        
        if (isResetTime()) {
            ConsolePlus.warn('It is reset time, not loading the app.');
            return;
        }
        
        ConsolePlus.log('FarmRPGPlus app initialized.');

        if (DebugPlus.isDevelopmentMode()) {
            ConsolePlus.warn('Development mode is enabled, debugging features are active.');
            DebugPlus.applyDebugFeatures();
        }

        if (RouterPlus.fixUrlHash()) {
            return;
        }

        if (window.mainView && mainView.container) {
            $(mainView.container).on('page:init', function () {
                if (RouterPlus.fixUrlHash()) {
                    return;
                }

                const page = myApp.getCurrentView().activePage || mainView.activePage;

                RouterPlus.handlePageChange(page);
            });
        }
    });
})();
