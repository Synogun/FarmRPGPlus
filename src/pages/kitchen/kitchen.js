import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import StoragePlus from '../../modules/storagePlus';

class KitchenPage {

    cachePlayerOvenAmount = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.cachePlayerOvenAmount.name,
            );
            return;
        }

        const $ovenAmount = $(page.container).find('a[href^="oven.php?num="]').last();
        if ($ovenAmount.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.cachePlayerOvenAmount.name,
            );
            return;
        }

        const ovenAmountText = $ovenAmount.attr('href')?.match(/num=(\d+)/)[1];
        const ovenAmount = parseInt(ovenAmountText, 10);
        if (isNaN(ovenAmount)) {
            ConsolePlus.warn('Invalid oven amount found:', ovenAmountText);
            return;
        }

        StoragePlus.set('player_oven_amount', ovenAmount);
    };

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Kitchen page initialized', page);
        this.cachePlayerOvenAmount(page);
    };
}

export default KitchenPage;
