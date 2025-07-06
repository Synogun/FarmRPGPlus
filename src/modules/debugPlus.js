import $ from 'jquery';
import { getListByTitle } from '../utils/utils';
import RouterPlus from './routerPlus';
import StoragePlus from './storagePlus';
class DebugPlus {

    isDevelopmentMode = () => {
        return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    };

    static goto = (hash) => {
        RouterPlus.goto(hash);
    };

    applyDebugFeatures = () => {
        $(mainView.container).on('page:init', function () {
            window.page = myApp.getCurrentView().activePage || mainView.activePage;
        });

        window.RouterPlus = RouterPlus;
        window.goto = DebugPlus.goto;
        window.getListByTitle = getListByTitle;
        window.StoragePlus = StoragePlus;
    };

}

export default new DebugPlus;
