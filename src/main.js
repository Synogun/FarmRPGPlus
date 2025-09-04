import $ from 'jquery';
import ConsolePlus from './modules/consolePlus';
import DebugPlus from './modules/debugPlus';
import RouterPlus from './modules/routerPlus';
import Pages from './pages/index';
import TimeControl from './utils/timeControl';

(function () {
    RouterPlus.registerHandlers(Pages);
    $(function () {

        const isReset = TimeControl.isResetTime();
        if (isReset === 1 || isReset === 2) {
            ConsolePlus.warn(`It is ${isReset === 2 ? 'reset' : 'backup'} time, not loading the app.`);
            return;
        }
        
        ConsolePlus.log('FarmRPG Plus app initialized.');

        if (DebugPlus.isDevelopmentMode()) {
            ConsolePlus.warn('Development mode is enabled, debugging features are active.');
            DebugPlus.applyDebugFeatures();
        }

        RouterPlus.fixUrlHash();

        if (window.mainView && mainView.container && !window.frpg_initialized) {
            let page = null;
            let lastPageCallback = null;
            $(mainView.container).on('page:init page:reinit', function () {
                if (lastPageCallback) {
                    lastPageCallback();
                }

                RouterPlus.fixUrlHash();
                page = myApp.getCurrentView().activePage || mainView.activePage;
                
                const currentPageCallback = RouterPlus.handlePageChange(page);
                if (currentPageCallback && typeof currentPageCallback === 'function') {
                    lastPageCallback = currentPageCallback;
                } else {
                    lastPageCallback = null;
                }
            });
            window.frpg_initialized = true;
        }
    });
})();
