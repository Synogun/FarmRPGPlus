import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import SettingsPlus from '../../modules/settingsPlus';

class FarmSupplyPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.FARM_SUPPLY, {
            displayName: 'Farm Supply',
            order: 100,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.FARM_SUPPLY,
            'addDisplayDiscounts',
            {
                title: 'Add discount indicators for on SALE items?',
                subtitle: 'Adds a discount percentage next to items that are on sale.',
                enabledByDefault: true,
                configs: {}
            }
        );
    }

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

    addDisplayDiscounts = (page) => {
        throwIfPageInvalid(page, this.addDisplayDiscounts.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.FARM_SUPPLY, 'addDisplayDiscounts')) {
            ConsolePlus.debug('Discount display is disabled in settings.');
            return;
        }

        const $originalPrices = $(page.container).find('span[style^=\'color:teal;\'] strong');

        if ($originalPrices.length === 0) {
            ConsolePlus.debug('No discounts found on the Farm Supply page.');
            return;
        }

        $originalPrices.each((index, element) => {
            const $discountedPrice = $(element).parents('.item-title').next();
            
            if ($discountedPrice.length === 0) {
                ConsolePlus.debug('No discounted price found for:', $(element).text());
                return;
            }

            const originalPrice = parseInt($(element).text().trim(), 10);
            const discountedPrice = parseInt($discountedPrice.text().trim(), 10);

            const discountFactor = 100 - ((100 * discountedPrice) / originalPrice);

            const itExists = $(page.container).find(`.frpgp-discount-after-${index}`).length > 0;
            if (!itExists && !isNaN(discountFactor) && discountFactor >= 0) {
                $discountedPrice.prepend('&nbsp;');
                $discountedPrice
                    .prepend(
                        `<span style="color: teal; font-weight: bold;" class='frpgp-discount-after-${index}'>${discountFactor.toFixed(2)}% Off</span>`
                    );
            }
        });

    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Farm Supply page initialized:', page);
        
        this.addDisplayDiscounts(page);
    };
}

export default FarmSupplyPage;
