import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import RouterPlus from '../../modules/routerPlus';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';
import { createCardList, createRow, getListByTitle } from '../../utils/utils';

class OvenPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.OVEN, {
            displayName: 'Oven Page',
            order: 100,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.OVEN,
            'addOvenNavigationButtons',
            {
                title: 'Oven Navigation Buttons',
                subtitle: 'Displays buttons to navigate between oven pages.',
                enableTitle: 'Enable Oven Navigation Buttons',
                enableSubtitle: 'If enabled, shows navigation buttons to go to next or previous oven pages.',
                enabledByDefault: true,
                configs: {
                    showNextButton: {
                        title: 'Show Next Button',
                        subtitle: 'Display a button to navigate to the next oven page.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    showPreviousButton: {
                        title: 'Show Previous Button',
                        subtitle: 'Display a button to navigate to the previous oven page.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    }
                }
            }
        );
    }

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
        throwIfPageInvalid(page, this.addOvenNavigationButtons.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.OVEN, 'addOvenNavigationButtons')) {
            ConsolePlus.debug('Oven navigation buttons are disabled.');
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

        const showNextButton = SettingsPlus.getValue(
            GamePagesEnum.OVEN,
            'addOvenNavigationButtons',
            'showNextButton',
            true
        );

        const showPreviousButton = SettingsPlus.getValue(
            GamePagesEnum.OVEN,
            'addOvenNavigationButtons',
            'showPreviousButton',
            true
        );

        if (!showNextButton && !showPreviousButton) {
            return;
        }

        const $navRow = createRow({
            iconImageUrl: IconsUrlEnum.OVEN_ICON,
            title: 'Oven Navigation',
            subtitle: 'Navigate to next or previous oven page',
            rowId: 'frpg-oven-navigation-row',
            afterLabel: [
                showPreviousButton ? $previousButton : null,
                '<p>&nbsp;</p>',
                showNextButton ? $nextButton : null
            ],
        });

        const $navCard = createCardList({
            cardId: 'frpg-oven-navigation-card',
            title: 'Oven Navigation',
            children: [$navRow],
        });
        const itExists = $(page.container).find('#frpg-oven-navigation-card').length > 0;

        if (!this.isCurrentlyCooking(page) && !this.isCookingComplete(page) && !itExists) {
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
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Oven page initialized', page);
        this.addOvenNavigationButtons(page);
    };
}

export default OvenPage;
