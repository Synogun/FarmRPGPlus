import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import SettingsPlus from '../../modules/settingsPlus';

class WorkshopPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.WORKSHOP, {
            displayName: 'Workshop Page',
            order: 2,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.WORKSHOP,
            'addCraftingBonusIndicator',
            {
                title: 'Crafting Bonus Indicator',
                subtitle: 'Displays a indicator next to crafting items showing how much bonus resources will be crafted with resource saver.',
                enableTitle: 'Enable Crafting Bonus Indicator',
                enableSubtitle: 'If enabled, shows the indicator next to crafting items.',
                enabledByDefault: true,
                configs: {
                    onlyWhenAboveZero: {
                        title: 'Show only when greater than zero',
                        subtitle: 'If enabled, the crafting bonus indicator will only be shown when the crafting bonus is greater than zero.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    }
                }
            }
        );
    }

    static titles = Object.freeze({
        FAVORITE_ITEMS: 'Workshop',
        CRAFTING: 'Crafting',
    });

    getResourceSaverFactor = (page) => {
        throwIfPageInvalid(page, this.getResourceSaverFactor.name);

        const $firstCardContent = $(page.container).find('.progressbar').next('.card');
        if ($firstCardContent.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addCraftingBonusIndicator.name,
                'Resource saver card content not found in the workshop page.'
            );
        }

        const cardText = $firstCardContent.text().trim();
        const resourceSaverMatch = cardText.match(/Your resource saver perk is (\d+)%\./);

        let resourceSaverPercent = 0;
        if (resourceSaverMatch) {
            resourceSaverPercent = parseInt(resourceSaverMatch[1], 10) / 100;
        }

        if (isNaN(resourceSaverPercent) || resourceSaverPercent < 0) {
            ConsolePlus.warn('Invalid resource saver percentage found:', resourceSaverPercent);
            return 0; // Default to 0 if invalid
        }

        return resourceSaverPercent;
    };

    addCraftingBonusIndicator = (page) => {
        throwIfPageInvalid(page, this.addCraftingBonusIndicator.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.WORKSHOP, 'addCraftingBonusIndicator')) {
            ConsolePlus.log('Crafting bonus indicator is disabled in settings.');
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

        $itemRowTitles.each((_, element) => {
            const $input = $(element).find('input');

            if ($input.length === 0 || $input.val() === '0') {
                return;
            }

            const parsedValue = parseInt($input.val(), 10);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                return;
            }

            const bonusValue = Math.floor(parsedValue * resourceSaver);

            const $minusButton = $input.prev('button');
            if ($minusButton.length === 0) {
                ConsolePlus.warn('Minus button not found for input:', $input);
                return;
            }

            const $plusButton = $input.next('button');
            if ($plusButton.length === 0) {
                ConsolePlus.warn('Plus button not found for input:', $input);
                return;
            }

            const $indicator = $('<span>')
                .addClass('frpgp-crafting-bonus-indicator')
                .attr('title', 'Crafting bonus with resource saver')
                .css({
                    'color': 'green',
                    'margin-left': '5px',
                    'font-weight': 'bold',
                    'font-size': '14px',
                })
                .text(`(${addCommas(bonusValue.toString())})`);

            const onlyWhenAboveZero = SettingsPlus.getValue(
                GamePagesEnum.WORKSHOP,
                'addCraftingBonusIndicator',
                'onlyWhenAboveZero',
                true
            );

            if (onlyWhenAboveZero && bonusValue <= 0) {
                ConsolePlus.log('Crafting bonus is zero or less, not displaying indicator.');
                $indicator.text('');
            }

            const itExistsInput = $(element).find('.frpgp-crafting-bonus-indicator').length > 0;

            if (!itExistsInput) {
                $(element).append($indicator);
            }

            $input.on('change change.frpgplus', (evt, extra) => {
                evt.preventDefault();
                evt.stopPropagation();

                let currentValue = parseInt($input.val(), 10);

                if (extra?.offset) {
                    currentValue += extra.offset;
                }

                if (isNaN(currentValue) || currentValue < 0) {
                    $indicator.text('');
                    return;
                }

                const onlyWhenAboveZero = SettingsPlus.getValue(
                    GamePagesEnum.WORKSHOP,
                    'addCraftingBonusIndicator',
                    'onlyWhenAboveZero',
                    true
                );

                const newBonusValue = Math.floor(currentValue * resourceSaver);
                if (newBonusValue <= 0 && onlyWhenAboveZero) {
                    $indicator.text('');
                } else {
                    $indicator.text(`(${addCommas(newBonusValue.toString())})`);
                }

                return;
            });

            $minusButton.on('click', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                const onMin = $input.val() === '0';
                if (!onMin) {
                    $input.trigger('change.frpgplus', { offset: -1 });
                }
            });

            $plusButton.on('click', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                const onMax = parseInt($input.val(), 10) >= parseInt($input.attr('data-max'), 10);
                if (!onMax) {
                    $input.trigger('change.frpgplus', { offset: 1 });
                }
            });
        });
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Workshop page initialized:', page);
        this.addCraftingBonusIndicator(page);
    };
}

export default WorkshopPage;
