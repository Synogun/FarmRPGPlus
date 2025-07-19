import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import StoragePlus from '../../modules/storagePlus';

class KitchenPage {

    cachePlayerOvenAmount = (page) => {
        throwIfPageInvalid(page, this.cachePlayerOvenAmount.name);

        const $ovenAmount = $(page.container).find('a[href^="oven.php?num="]').last();
        if ($ovenAmount.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.cachePlayerOvenAmount.name,
                'Oven amount link not found in the kitchen page.'
            );
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
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Kitchen page initialized', page);
        this.cachePlayerOvenAmount(page);
    };
}

export default KitchenPage;
