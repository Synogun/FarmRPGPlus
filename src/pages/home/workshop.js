import $ from 'jquery';
import { FarmRPGPlusError, ErrorTypesEnum } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';

class WorkshopPage {

    static titles = Object.freeze({
        FAVORITE_ITEMS: 'Workshop',
        CRAFTING: 'Crafting',
    });

    getResourceSaverFactor = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.getResourceSaverFactor.name,
            );
            return 1;
        }

        const $firstCardContent = $(page.container).find('.progressbar').next('.card');
        if ($firstCardContent.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addCraftingBonusIndicator.name,
            );
        }
    };

    addCraftingBonusIndicator = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addCraftingBonusIndicator.name,
            );
            return;
        }

        let $itemRowTitles = $(page.container).find('.item-title');
        if ($itemRowTitles.length <= 3) {
            ConsolePlus.warn('No item titles found in the workshop page.');
            return;
        } else {
            $itemRowTitles = $itemRowTitles.slice(3); // Skip the first 3 titles
        }

        const resourceSaver = this.getResourceSaverFactor(page);

        $itemRowTitles.each((index, element) => {
            const $input = $(element).find('input');

            if ($input.length === 0) {
                ConsolePlus.warn('No input found in item title:', element);
                return;
            }

            if ($input.val() === '0') {
                return; // Skip if the input value is 0
            }

            const parsedValue = parseInt($input.val(), 10);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                return;
            }

            const $indicator = $('<span>')
                .addClass('frpgp-crafting-bonus-indicator')
                .text(`+ ${parsedValue}`)
                .css({
                    'color': 'green',
                    'margin-left': '5px',
                    'font-weight': 'bold',
                    'font-size': '14px',
                });

            const itExistsInput = $(element).find('.frpgp-crafting-bonus-indicator').length > 0;

            if (!itExistsInput) {
                $(element).append($indicator);
            }

            // const $finalQtyIndicator = $(span)
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

        ConsolePlus.log('Workshop page initialized:', page);
        this.addCraftingBonusIndicator(page);
    };
}

export default WorkshopPage;
