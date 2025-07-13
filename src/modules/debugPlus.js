import $ from 'jquery';
import { getListByTitle } from '../utils/utils';
import RouterPlus from './routerPlus';
import StoragePlus from './storagePlus';
class DebugPlus {

    static isDevelopmentMode = () => {
        return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    };

    static goto = (hash) => {
        RouterPlus.goto(hash);
    };

    static applyDebugFeatures = () => {
        $(mainView.container).on('page:init', function () {
            window.page = myApp.getCurrentView().activePage || mainView.activePage;
        });

        window.clearDevLs = () => {
            StoragePlus.clear('frpg_plus_dev');
            console.debug('Development local storage cleared.');
        };
        window.StoragePlus = StoragePlus;
        window.RouterPlus = RouterPlus;
        window.goto = DebugPlus.goto;
        window.getListByTitle = getListByTitle;
    };

}

export default DebugPlus;
