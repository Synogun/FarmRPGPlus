import $ from 'jquery';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';

/** Hidden Feature */
class SettingsEmblemsPage {

    increaseEmblemSize = (page) => {
        throwIfPageInvalid(page, this.increaseEmblemSize.name);
        $(page.container).find('.vendoritemimg').addClass('itemimg');
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Settings Emblems page initialized:', page);
        this.increaseEmblemSize(page);
    };
}

export default SettingsEmblemsPage;
