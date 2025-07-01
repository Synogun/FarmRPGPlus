import $ from 'jquery';
import ConsolePlus from './modules/consolePlus';
import RouterPlus from './modules/routerPlus';
import Pages from './pages/index';
import { isResetTime } from './utils/utils';

// Registering page handlers
RouterPlus.register(RouterPlus.Pages.INDEX, Pages.home.apply);
RouterPlus.register(RouterPlus.Pages.QUESTS, Pages.quests.apply);
RouterPlus.register(RouterPlus.Pages.NPCS, Pages.npcs.apply);

RouterPlus.register(RouterPlus.Pages.ITEM, Pages.item.apply);
RouterPlus.register(RouterPlus.Pages.QUEST, Pages.quest.apply);

// Town pages
RouterPlus.register(RouterPlus.Pages.WELL, Pages.well.apply);

(function () {
    'use strict';
    $(function () {
        if (isResetTime()) {
            ConsolePlus.warn('It is reset time, not loading the app.');
            return;
        }

        RouterPlus.fixUrlHash();

        if (window.mainView && mainView.container) {
            $(mainView.container).on('page:init', function () {
                RouterPlus.fixUrlHash();

                const page = myApp.getCurrentView().activePage || mainView.activePage;
                // const page = mainView;

                RouterPlus.handlePageChange(page);
                // RouterPlus.fixBackButton(page);
            });
        }
    });
})();
