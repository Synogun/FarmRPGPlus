import $ from 'jquery';
import IconsUrlEnum from '../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import RouterPlus from '../modules/routerPlus';
import StoragePlus from '../modules/storagePlus';
import { createCardList, createRow, getListByTitle } from '../utils/utils';

class OvenPage {

    static titles = Object.freeze({
        LEARNED_RECIPES: 'Learned Recipes',
        CURRENTLY_COOKING: 'Currently Cooking',
        COOKING_OPTIONS: 'Cooking Options',
        OTHER_OPTIONS: 'Other Options'
    });

    isCurrentlyCooking = (page) => {
        if (!page?.container) {
            return false;
        }

        const $currentlyCookingTitle = getListByTitle(page, OvenPage.titles.CURRENTLY_COOKING);
        const $collectMealButton = $(page.container).find('a.cookreadybtn');
        return $currentlyCookingTitle && $collectMealButton.length === 0;
    };

    isCookingComplete = (page) => {
        if (!page?.container) {
            return false;
        }

        const $collectMealButton = $(page.container).find('a.cookreadybtn');

        return $collectMealButton.length === 1;
    };

    addOvenNavigationButtons = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addOvenNavigationButtons.name,
            );
            return;
        }

        const playerOvens = StoragePlus.get('player_oven_amount') || 1;
        const currentOven = parseInt(page?.query?.num || 1, 10);

        const $previousButton = $('<a>')
            .addClass('button btngreen')
            .text('Previous')
            .on('click', () => {
                RouterPlus.goto(`#!/oven.php?num=${currentOven === 1 ? playerOvens : currentOven - 1}`);
            });

        const $nextButton = $('<a>')
            .addClass('button btngreen')
            .text('  Next  ')
            .on('click', (e) => {
                e.preventDefault();
                RouterPlus.goto(`#!/oven.php?num=${currentOven === playerOvens ? 1 : currentOven + 1}`);
            });

        const $navRow = createRow({
            iconImageUrl: IconsUrlEnum.OVEN_ICON,
            title: 'Oven Navigation',
            subtitle: 'Navigate to next or previous oven page',
            rowId: 'frpg-oven-navigation-row',
            afterLabel: [$previousButton, '<p>&nbsp;</p>', $nextButton],
        });

        const $navCard = createCardList({
            cardId: 'frpg-oven-navigation-card',
            title: 'Oven Navigation',
            children: [$navRow],
        });
        const itExists = $(page.container).find('#frpg-oven-navigation-card').length > 0;
        
        if (!this.isCurrentlyCooking(page) && !itExists) {
            getListByTitle(
                page,
                OvenPage.titles.LEARNED_RECIPES,
                { returnTitle: true }
            ).before($navCard);
        } else if (!itExists) {
            getListByTitle(
                page,
                OvenPage.titles.CURRENTLY_COOKING,
                { returnTitle: true }
            ).before($navCard);
        }
    };

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Oven page initialized', page);
        this.addOvenNavigationButtons(page);
    };
}

export default OvenPage;
