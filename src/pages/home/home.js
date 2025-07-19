import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { getListByTitle } from '../../utils/utils';

class HomePage {
    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.HOME, {
            displayName: 'Home Page',
            order: 1,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.HOME,
            'addBuddyFarmButton',
            {
                title: 'Add Buddy Farm Button?',
                subtitle: 'Adds a button that links to Buddy Farm homepage.',
                enabledByDefault: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.HOME,
            'hideMaxedSkills',
            {
                title: 'Hide Maxed Skills',
                subtitle: 'Hides skills that are already maxed out on the home page.',
                enabledByDefault: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.HOME,
            'highlightReadyActions',
            {
                title: 'Highlight Ready Rows',
                subtitle: 'Highlights rows that are ready for interaction, making it easier to identify them.',
                enableTitle: 'Enable Highlighting',
                enableSubtitle: 'If enabled, rows that are ready for interaction will be glowing.',
                enabledByDefault: true,
                configs: {
                    highlightReadyCrops: {
                        title: 'Highlight Ready Crops',
                        subtitle: 'Highlights the "My Farm" row if it has ready crops.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightReadyMeals: {
                        title: 'Highlight Ready Meals',
                        subtitle: 'Highlights the "Kitchen" row if it has ready meals.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightMealsAttention: {
                        title: 'Highlight Meals Attention',
                        subtitle: 'Highlights the "Kitchen" row if it has meals that need attention.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightFishBaiting: {
                        title: 'Highlight Fish Baiting',
                        subtitle: 'Highlights the "Fishing" row if a location is baiting.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightQuestsReady: {
                        title: 'Highlight Ready Quests',
                        subtitle: 'Highlights the "Quests" row if it has quests ready to complete.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightAvailablePerks: {
                        title: 'Highlight Available Perks',
                        subtitle: 'Highlights the "Perks" row if it has available perks.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightReadyMastery: {
                        title: 'Highlight Ready Mastery',
                        subtitle: 'Highlights the "Mastery" row if it has mastery ready to claim.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightNPCGiftsReady: {
                        title: 'Highlight NPC Gifts Ready',
                        subtitle: 'Highlights the "NPC Gifts" row if it has level gifts ready to claim.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    highlightReadyDailyChores: {
                        title: 'Highlight Ready Daily Chores',
                        subtitle: 'Highlights the "Daily Chores" row if it has chores ready to complete.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    }
                }
            }
        );
    }

    static titles = Object.freeze({
        HOME: 'Where do you want to go?',
        MY_SKILLS: 'My skills',
        PERKS_AND_MASTERY: 'Perks, Mastery & More',
        UPDATE: 'Most Recent Update',
        OTHER_STUFF: 'Other Stuff'
    });

    addBuddyFarmButton = (page) => {
        throwIfPageInvalid(page, this.addBuddyFarmButton.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'addBuddyFarmButton')) {
            ConsolePlus.debug('Buddy Farm button is disabled in settings.');
            return;
        }

        const $li = createRow({
            iconImageUrl: IconsUrlEnum.BUDDY_FARM,
            title: 'Buddy Farm',
            subtitle: 'Open\'s Buddy Farm Home Page',
            rowLink: 'https://buddy.farm',
            rowId: 'frpgp-buddy-farm-row',
        });

        const itExists = $(page.container).find('#frpgp-buddy-farm-row').length > 0;
        if (!itExists) {
            const $list = getListByTitle(page, HomePage.titles.HOME);
            $list.append($li);
        }
        
    };

    hideMaxedSkills = (page) => {
        throwIfPageInvalid(page, this.hideMaxedSkills.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'hideMaxedSkills')) {
            ConsolePlus.debug('Hiding maxed skills is disabled in settings.');
            return;
        }

        const $skillRows = getListByTitle(
            page,
            HomePage.titles.MY_SKILLS,
            { returnTitle: true }
        ).next('.card').find('.row');

        if ($skillRows.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.hideMaxedSkills.name,
                'No skill rows found after "My skills" title.',
            );
        }

        $skillRows.each((_index, element) => {
            const $row = $(element);
            
            $row.children().each((_, skill) => {
                const $skill = $(skill);

                if ($skill.find('.progressbar-infinite').length > 0) {
                    $skill.remove();
                }
            });

            if ($row.children().length === 0) {
                $row.remove();
            } else if ($row.children().length === 1) {
                $row.children().removeClass('col-33');
                $row.children().addClass('col-100');
            } else if ($row.children().length === 2) {
                $row.children().removeClass('col-33');
                $row.children().addClass('col-50');
            }
        });
    };

    highlightReadyActions = (page) => {
        throwIfPageInvalid(page, this.highlightReadyActions.name);
     
        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'highlightReadyActions')) {
            ConsolePlus.debug('Highlighting ready rows is disabled in settings.');
            return;
        }

        const toCheck = configName => SettingsPlus.getValue(GamePagesEnum.HOME, 'highlightReadyActions', configName);

        const allRows = [
            { configName: 'highlightReadyCrops', title: 'My Farm', textToCheck: 'READY!', setInterval: true },
            { configName: 'highlightReadyMeals', title: 'My Kitchen', textToCheck: 'READY!', setInterval: true },
            { configName: 'highlightMealsAttention', title: 'My Kitchen', textToCheck: 'Attention!', setInterval: true },
            { configName: 'highlightFishBaiting', title: 'Fishing', textToCheck: 'BITING!', setInterval: true },
            { configName: 'highlightQuestsReady', title: 'Help Needed', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightAvailablePerks', title: 'Perks', textToCheck: 'Available', setInterval: false },
            { configName: 'highlightReadyMastery', title: 'Mastery', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightNPCGiftsReady', title: 'NPC Gifts', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightReadyDailyChores', title: 'Daily Chores', textToCheck: 'READY!', setInterval: false }
        ];
        
        const rowsToCheck = allRows.filter((row) => {
            const isEnabled = toCheck(row.configName);
            if (!isEnabled) {
                ConsolePlus.debug(`${row.configName} is disabled in settings.`);
            }
            return isEnabled;
        });

        let timeoutIds = [];

        rowsToCheck.forEach((row) => {
            const $row = $(page.container).find(`a:contains("${row.title}")`);

            if ($row.length === 0) {
                ConsolePlus.debug(`Row "${row.title}" not found.`);
                return;
            }

            if ($row.find(`.item-after:contains("${row.textToCheck}")`).length > 0) {
                $row.addClass('glow1');
            } else if (row.setInterval) {
                let timeoutId = window.setInterval(() => {
                    const $after = $row.find('.item-after');
                    if ($after.length > 0 && $after.text().includes(row.textToCheck)) {
                        $row.addClass('glow1');
                        window.clearInterval(timeoutId);
                        timeoutIds = timeoutIds.filter(id => id !== timeoutId);
                    }
                }, 10000); // Check every 10 seconds
                timeoutIds.push(timeoutId);
            }
        });

        return () => {
            // Clear all timeouts when the page is unloaded or the feature is disabled
            timeoutIds.forEach(id => window.clearInterval(id));
            timeoutIds = [];
            ConsolePlus.debug('Cleared all highlight row intervals.');
        };
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Index page initialized:', page);
        this.addBuddyFarmButton(page);
        this.hideMaxedSkills(page);
        const callback = this.highlightReadyActions(page);

        return callback;
    };
}

export default HomePage;
