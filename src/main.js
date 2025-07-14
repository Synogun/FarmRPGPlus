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

        if (window.mainView && mainView.container) {
            $(mainView.container).on('page:init page:reinit', function () {
                RouterPlus.fixUrlHash();

                const page = myApp.getCurrentView().activePage || mainView.activePage;

                const callback = RouterPlus.handlePageChange(page);

                if (callback && typeof callback === 'function') {
                    ConsolePlus.debug(`Running callback for page: ${page.name}`);
                    callback(page);
                }
            });
        }
    });
})();
