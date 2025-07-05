import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';

class FarmSupplyPage {

    static titles = Object.freeze({
        CAP_UPGRADES: 'Cap Upgrades',
        UPGRADES_ON_SALE: 'Upgrades on Sale (Changes on Mondays)',
        FARMING_UPGRADES: 'Farming Upgrades',
        FISHING_UPGRADES: 'Fishing Upgrades',
        CRAFTING_UPGRADES: 'Crafting Upgrades',
        EXPLORING_UPGRADES: 'Exploring Upgrades',
        COOKING_UPGRADES: 'Cooking Upgrades',
        QUALITY_OF_LIFE_UPGRADES: 'Quality of Life Upgrades',
        BANK_UPGRADES: 'Bank Upgrades',
        ORCHARD_UPGRADES: 'Orchard Upgrades',
        WINE_CELLAR_UPGRADES: 'Wine Cellar Upgrades',
        LIVESTOCK_UPGRADES: 'Livestock Upgrades',
        WHEEL_OF_BORGEN_UPGRADES: 'Wheel of Borgen Upgrades',
        MISCELLANEOUS_UPGRADES: 'Miscellaneous Upgrades',
        ARTIFACT_UPGRADES: 'Artifact Upgrades'
    });

    displayDiscounts = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.displayDiscounts.name,
            );
            return;
        }

        const $originalPrices = $(page.container).find('span[style^=\'color:teal;\'] strong');

        if ($originalPrices.length === 0) {
            ConsolePlus.log('No discounts found on the Farm Supply page.');
            return;
        }

        $originalPrices.each((index, element) => {
            const $discountedPrice = $(element).parents('.item-title').next();
            
            if ($discountedPrice.length === 0) {
                ConsolePlus.log('No discounted price found for:', $(element).text());
                return;
            }

            const originalPrice = parseInt($(element).text().trim(), 10);
            const discountedPrice = parseInt($discountedPrice.text().trim(), 10);

            const discountFactor = 100 - ((100 * discountedPrice) / originalPrice);

            const itExists = $(page.container).find('.frpgp-discount-after').length > 0;
            if (!itExists && !isNaN(discountFactor) && discountFactor >= 0) {
                $discountedPrice.prepend('&nbsp;');
                $discountedPrice.prepend(
                    `<span style="color: teal; font-weight: bold;" class='frpgp-discount-after'>${discountFactor.toFixed(2)}% Off</span>`
                );
            }
        });

    };

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Farm Supply page initialized:', page);
        
        this.displayDiscounts(page);
    };
}

export default FarmSupplyPage;
