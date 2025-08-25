import $ from 'jquery';
import GamePagesEnum, { MyFarmPageLinks } from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';
import TimeControl from '../../utils/timeControl';
import { createCardList, getListByTitle, isDarkMode } from '../../utils/utils';

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
                    highlightStyle: {
                        title: 'Highlight Style',
                        subtitle: 'Choose how the ready rows should be highlighted.',
                        type: 'select',
                        typeData: {
                            defaultValue: 'glow',
                            options: [
                                { value: 'none', label: 'None' },
                                { value: 'glow', label: 'Glow' },
                                { value: 'border', label: 'Border' },
                            ],
                        }
                    },
                    highlightColor: {
                        title: 'Highlight Color',
                        subtitle: 'Choose the color for the highlight.',
                        type: 'select',
                        typeData: {
                            defaultValue: 'teal',
                            options: [
                                { value: 'teal', label: 'Teal' },
                                { value: 'red', label: 'Red' },
                                { value: 'blue', label: 'Blue' },
                                { value: 'green', label: 'Green' },
                                { value: 'gold', label: 'Gold' },
                            ],
                        }
                    },
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
                    },
                    highlightReadyEvents: {
                        title: 'Highlight Ready Events',
                        subtitle: 'Highlights the event rows if they are ready to interact.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    }
                }
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.HOME,
            'addDailyChecklist',
            {
                title: 'Add Daily Checklist',
                subtitle: 'Adds a daily checklist to the home page.',
                enableTitle: 'Enable Daily Checklist',
                enableSubtitle: 'If enabled, a daily checklist will be displayed on the home page.',
                enabledByDefault: true,
                configs: {
                    trackBankSilver: {
                        title: 'Track Bank Silver',
                        subtitle: 'Tracks if you have banked silver today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackCommunityCenter: {
                        title: 'Track Community Center Donations',
                        subtitle: 'Tracks if you have donated to the Community Center today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackAnimalWork: {
                        title: 'Track Animal Work',
                        subtitle: 'Tracks if you have done your animal work today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackFarmWork: {
                        title: 'Track Farm Work',
                        subtitle: 'Tracks if you have done your farm work today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackCraftingFruit: {
                        title: 'Track Crafting Fruit',
                        subtitle: 'Tracks if you have crafted fruit today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackSlaughterAnimals: {
                        title: 'Track Slaughter Animals',
                        subtitle: 'Tracks if you have sent pigs / cows to slaughterhouse today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackDailyChores: {
                        title: 'Track Daily Chores',
                        subtitle: 'Tracks if you have completed your daily chores today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackWishingWell: {
                        title: 'Track Wishing Well',
                        subtitle: 'Tracks if you have thrown items into the Wishing Well today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackGrapeJuice: {
                        title: 'Track Grape Juice',
                        subtitle: 'Tracks if you have used your Grape Juice today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackTradingBorgen: {
                        title: 'Track Trading in Borgen\'s Camp',
                        subtitle: 'Tracks if you have traded in Borgen\'s Camp today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackSpinningWheel: {
                        title: 'Track Spinning Wheel',
                        subtitle: 'Tracks if you have spun the Wheel today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackCrackingVault: {
                        title: 'Track Cracking Vault',
                        subtitle: 'Tracks if you have cracked the daily Vault today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackExchangeCenter: {
                        title: 'Track Exchange Center',
                        subtitle: 'Tracks if you have visited the Exchange Center today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackCraftingDailyProduction: {
                        title: 'Track Crafting Daily Production',
                        subtitle: 'Tracks if you have crafted your daily production items today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackSendingGifts: {
                        title: 'Track Sending Gifts',
                        subtitle: 'Tracks if you have sent gifts to NPCs today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackSellingKabobs: {
                        title: 'Track Selling Kabobs',
                        subtitle: 'Tracks if you have sold your Raptor Kabobs today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackPHRQuests: {
                        title: 'Track Personal Help Requests',
                        subtitle: 'Tracks if you have completed your personal help requests today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    },
                    trackPlayingBuddyjack: {
                        title: 'Track Playing Buddyjack',
                        subtitle: 'Tracks if you have played against buddy in the House of Cards today.',
                        type: 'checkbox',
                        typeData: { defaultValue: true }
                    }
                }
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.HOME,
            'announceNewUpdate',
            {
                title: 'Announce New Update',
                subtitle: 'Shows a card with the most recent update when it is available.',
                enableTitle: 'Enable New Update Announcement',
                enableSubtitle: 'If enabled, a card will be displayed on the top of home page.',
                enabledByDefault: true,
                configs: {
                    highlightStyle: {
                        title: 'Highlight Style',
                        subtitle: 'Choose how the new update announcement should be highlighted.',
                        type: 'select',
                        typeData: {
                            defaultValue: 'border',
                            options: [
                                { value: 'none', label: 'None' },
                                { value: 'border', label: 'Border' },
                                { value: 'glow', label: 'Glow' },
                                { value: 'background', label: 'Background' }
                            ],
                        }
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

    cachePlayerId = (page) => {
        throwIfPageInvalid(page, this.cachePlayerId.name);

        const myFarmRow = $(page.container).find('a:contains("My Farm")');

        if (myFarmRow.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.cachePlayerId.name,
                'My Farm row not found on the home page.',
            );
        }

        const playerId = myFarmRow.attr('href').split('?id=')[1];

        if (!playerId) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.cachePlayerId.name,
                'Player ID not found in My Farm row link.',
            );
        }

        StoragePlus.set('player_id', playerId);
        ConsolePlus.debug(`Player ID cached: ${playerId}`);
    };

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
            { configName: 'highlightReadyMastery', title: 'Mastery Progress', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightNPCGiftsReady', title: 'NPC Gifts', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightReadyDailyChores', title: 'Daily Chores', textToCheck: 'READY!', setInterval: false },
            { configName: 'highlightReadyEvents', title: 'Bottle Rocket Brawl', textToCheck: 'READY!', setInterval: false },
        ];
        
        const rowsToCheck = allRows.filter((row) => {
            const isEnabled = toCheck(row.configName);
            if (!isEnabled) {
                ConsolePlus.debug(`${row.configName} is disabled in settings.`);
            }
            return isEnabled;
        });

        let timeoutIds = [];

        const highlightStyle = SettingsPlus.getValue(GamePagesEnum.HOME, 'highlightReadyActions', 'highlightStyle');
        const highlightColor = SettingsPlus.getValue(GamePagesEnum.HOME, 'highlightReadyActions', 'highlightColor');

        const applyHighlight = ($row) => {
            const colorMapping = {
                teal: 'rgba(0, 255, 255, 0.55)',
                red: 'rgba(255, 0, 0, 0.55)',
                blue: 'rgba(0, 0, 255, 0.46)',
                green: 'rgba(0, 255, 0, 0.55)',
                gold: 'rgba(255, 215, 0, 0.55)'
            };

            if (highlightStyle === 'none') {
                return;
            } else if (highlightStyle === 'glow') {
                $row.addClass('glow1');
            } else if (highlightStyle === 'border') {
                $row.css({ border: `2px dashed ${colorMapping[highlightColor]}` });
            }
        };

        rowsToCheck.forEach((row) => {
            const $row = $(page.container).find(`a:contains("${row.title}")`);

            if ($row.length === 0) {
                return;
            }

            if ($row.find(`.item-after:contains("${row.textToCheck}")`).length > 0) {
                applyHighlight($row);
            } else if (row.setInterval) {
                let timeoutId = window.setInterval(() => {
                    const $after = $row.find('.item-after');
                    if ($after.length > 0 && $after.text().includes(row.textToCheck)) {
                        applyHighlight($row);
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

    _rebalanceRows = (startRow) => {
        const threshold = window.innerWidth <= 450 ? 2 : 3;
        let currentRow = startRow;

        while (currentRow.length > 0) {
            if (currentRow.children().length < threshold) {
                let nextRow = currentRow.next('.row');

                while (nextRow.length > 0) {

                    if (nextRow.children().length > 0) {
                        const $firstChild = nextRow.children().first().detach();
                        currentRow.append($firstChild);

                        if (nextRow.children().length === 0) {
                            const tempNext = nextRow.next('.row');
                            nextRow.remove();
                            nextRow = tempNext;
                        }
                        break;
                    } else {
                        // Skip empty rows
                        const tempNext = nextRow.next('.row');
                        nextRow.remove();
                        nextRow = tempNext;
                    }
                }
            }

            // Update column sizes for current row
            if (currentRow.children().length > 0) {
                const colSize = Math.floor(100 / currentRow.children().length);
                currentRow.children().each(function () {
                    $(this).removeClass(function (index, className) {
                        return (className.match(/(^|\s)col-\S+/g) || []).join(' ');
                    }).addClass(`col-${colSize}`);
                });
                currentRow = currentRow.next('.row');
            } else {
                // Remove empty rows
                const tempNext = currentRow.next('.row');
                currentRow.remove();
                currentRow = tempNext;
            }
        }
    };

    addDailyChecklist = (page) => {
        throwIfPageInvalid(page, this.addDailyChecklist.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'addDailyChecklist')) {
            ConsolePlus.debug('Daily checklist is disabled in settings.');
            return;
        }

        const defaultChecklistStorage = (map) => {
            const defaultChecklist = {
                date: (new Date).toISOString(),
                bankedSilver: {
                    title: 'Bank',
                    subtasks: [
                        { icon: IconsUrlEnum.BANK, link: GamePagesEnum.BANK, title: 'Bank' },
                    ],
                    configName: 'trackBankSilver',
                    completed: false
                },
                donatedCommunityCenter: {
                    title: 'Community Center',
                    subtasks: [
                        { icon: IconsUrlEnum.COMMUNITY_CENTER, link: GamePagesEnum.COMMUNITY_CENTER, title: 'Community Center' }
                    ],
                    configName: 'trackCommunityCenter',
                    completed: false
                },
                doneAnimalWork: {
                    title: 'Animal Work',
                    subtasks: [
                        { icon: IconsUrlEnum.CHICKEN_COOP, link: GamePagesEnum.CHICKEN_COOP, title: 'Chicken Coop' },
                        { icon: IconsUrlEnum.COW_PASTURE, link: GamePagesEnum.COW_PASTURE, title: 'Cow Pasture' },
                        { icon: IconsUrlEnum.PIG_PEN, link: GamePagesEnum.PIG_PEN, title: 'Pig Pen' },
                        { icon: IconsUrlEnum.RAPTOR_PEN, link: GamePagesEnum.RAPTOR_PEN, title: 'Raptor Pen' },
                    ],
                    configName: 'trackAnimalWork',
                    completed: false
                },
                doneFarmWork: {
                    title: 'Farm Work',
                    subtasks: [
                        { icon: IconsUrlEnum.STOREHOUSE, link: GamePagesEnum.STOREHOUSE, title: 'Storehouse' },
                        { icon: IconsUrlEnum.FARMHOUSE, link: GamePagesEnum.FARMHOUSE, title: 'Farmhouse' },
                        { icon: IconsUrlEnum.WINE_CELLAR, link: GamePagesEnum.WINE_CELLAR, title: 'Wine Cellar' },
                    ],
                    configName: 'trackFarmWork',
                    completed: false
                },
                doneCraftingFruit: {
                    title: 'Daily Fruits',
                    subtasks: [
                        { icon: IconsUrlEnum.ORANGE_JUICE, link: GamePagesEnum.ORANGE_JUICE, title: 'Orange Juice' },
                        { icon: IconsUrlEnum.APPLE_CIDER, link: GamePagesEnum.APPLE_CIDER, title: 'Apple Cider' },
                        { icon: IconsUrlEnum.LEMONADE, link: GamePagesEnum.LEMONADE, title: 'Lemonade' },
                        { icon: IconsUrlEnum.ARNOLD_PALMER, link: GamePagesEnum.ARNOLD_PALMER, title: 'Arnold Palmer' },
                    ],
                    configName: 'trackCraftingFruit',
                    completed: false
                },
                doneSlaughterAnimals: {
                    title: 'Slaughterhouse',
                    subtasks: [
                        { icon: IconsUrlEnum.PIG_PEN, link: GamePagesEnum.PIG_PEN, title: 'Pig Pen' },
                        { icon: IconsUrlEnum.COW_PASTURE, link: GamePagesEnum.COW_PASTURE, title: 'Cow Pasture' },
                    ],
                    configName: 'trackSlaughterAnimals',
                    completed: false
                },
                doneDailyChores: {
                    title: 'Daily Chores',
                    subtasks: [
                        { icon: IconsUrlEnum.DAILY_CHORES, link: GamePagesEnum.DAILY_CHORES, title: 'Daily Chores' }
                    ],
                    configName: 'trackDailyChores',
                    completed: false
                },
                doneThrowingInWell: {
                    title: 'Wishing Well',
                    subtasks: [
                        { icon: IconsUrlEnum.WISHING_WELL, link: GamePagesEnum.WISHING_WELL, title: 'Wishing Well' }
                    ],
                    configName: 'trackWishingWell',
                    completed: false
                },
                doneGrapeJuice: {
                    title: 'Grape Juice',
                    subtasks: [
                        { icon: IconsUrlEnum.MY_FARM, link: GamePagesEnum.MY_FARM, title: 'My Farm' },
                        { icon: IconsUrlEnum.GRAPE_JUICE_VAT, link: GamePagesEnum.GRAPE_JUICE_VAT, title: 'Grape Juice Vat' }
                    ],
                    configName: 'trackGrapeJuice',
                    completed: false
                },
                doneTradingBorgen: {
                    title: 'Borgen\'s Camp',
                    subtasks: [
                        { icon: IconsUrlEnum.BORGENS_CAMP, link: GamePagesEnum.BORGENS_CAMP, title: 'Borgen\'s Camp' }
                    ],
                    configName: 'trackTradingBorgen',
                    completed: false
                },
                doneSpinningWheel: {
                    title: 'Wheel of Borgen',
                    subtasks: [
                        { icon: IconsUrlEnum.WHEEL_OF_BORGEN, link: GamePagesEnum.WHEEL_OF_BORGEN, title: 'Wheel of Borgen' }
                    ],
                    configName: 'trackSpinningWheel',
                    completed: false
                },
                doneCrackingVault: {
                    title: 'Vault',
                    subtasks: [
                        { icon: IconsUrlEnum.VAULT, link: GamePagesEnum.VAULT, title: 'Vault' }
                    ],
                    configName: 'trackCrackingVault',
                    completed: false
                },
                doneExchangeCenter: {
                    title: 'Exchange Center',
                    subtasks: [
                        { icon: IconsUrlEnum.EXCHANGE_CENTER, link: GamePagesEnum.EXCHANGE_CENTER, title: 'Exchange Center' }
                    ],
                    configName: 'trackExchangeCenter',
                    completed: false
                },
                doneCraftingDailyProduction: {
                    title: 'Daily Produce',
                    subtasks: [
                        { icon: IconsUrlEnum.ANTLER, link: GamePagesEnum.ANTLER, title: 'Antler' },
                        { icon: IconsUrlEnum.MILK, link: GamePagesEnum.MILK, title: 'Milk' },
                        { icon: IconsUrlEnum.FEATHERS, link: GamePagesEnum.FEATHERS, title: 'Feathers' },
                        { icon: IconsUrlEnum.EGGS, link: GamePagesEnum.EGGS, title: 'Eggs' },
                    ],
                    configName: 'trackCraftingDailyProduction',
                    completed: false
                },
                doneSendingGifts:{
                    title: 'NPCs Gifts',
                    subtasks:[
                        { icon: IconsUrlEnum.TROUT, link: GamePagesEnum.TROUT, title: 'Trout' },
                        { icon: IconsUrlEnum.EGGS, link: GamePagesEnum.EGGS, title: 'Eggs' },
                        { icon: IconsUrlEnum.MILK, link: GamePagesEnum.MILK, title: 'Milk' },
                    ],
                    configName: 'trackSendingGifts',
                    completed: false
                },
                doneSellingKabobs: {
                    title: 'Raptor Kabobs',
                    subtasks: [
                        { icon: IconsUrlEnum.STEAK_MARKET, link: GamePagesEnum.STEAK_MARKET, title: 'Steak Market' },
                    ],
                    configName: 'trackSellingKabobs',
                    completed: false
                },
                donePHRQuests: {
                    title: 'Personal Help Requests',
                    subtasks: [
                        { icon: IconsUrlEnum.HELP_NEEDED, link: GamePagesEnum.HELP_NEEDED, title: 'Help Needed' }
                    ],
                    configName: 'trackPHRQuests',
                    completed: false
                },
                donePlayingBuddyjack: {
                    title: 'House of Cards',
                    subtasks: [
                        { icon: IconsUrlEnum.HOUSE_OF_CARDS, link: GamePagesEnum.HOUSE_OF_CARDS, title: 'House of Cards' }
                    ],
                    configName: 'trackPlayingBuddyjack',
                    completed: false
                }
            };

            return map
                ? Object.keys(defaultChecklist).reduce((acc, key) => {
                    if (key === 'date') {
                        acc[key] = defaultChecklist[key];
                    } else {
                        acc[key] = defaultChecklist[key].completed;
                    }
                    return acc;
                }, {})
                : defaultChecklist;
        };
            
        let completedTasks = StoragePlus.get('checklist_storage') || defaultChecklistStorage(true);

        if (!TimeControl.sameDay(completedTasks.date, (new Date).toISOString())) {
            ConsolePlus.debug('Daily checklist storage reset for a new day.');
            completedTasks = defaultChecklistStorage(true);
            StoragePlus.set('checklist_storage', completedTasks);
        }

        const $checklistGrid = $('<div>')
            .addClass('card-content-inner');
            
        let checklist = defaultChecklistStorage(false);
        delete checklist.date;
            
        const toCheck = key => SettingsPlus.getValue(GamePagesEnum.HOME, 'addDailyChecklist', key, null);
        
        checklist = Object.values(checklist).filter((task) => {
            if (!toCheck(task.configName)) {
                ConsolePlus.debug(`${task.configName} is disabled in settings.`);
                return false;
            }

            const isCompleted = completedTasks[task.configName] === true;
            if (isCompleted) {
                return false;
            }

            if (task.configName === 'trackTradingBorgen' && !TimeControl.isTodayWednesday()) {
                return false;
            }

            return true;
        });

        const fixLink = (link = '') => {
            if (!link) return '';

            if (!link.includes('.php')) {
                return `${link}.php`;
            } else if (Object.values(MyFarmPageLinks).includes(link)) {
                const playerId = StoragePlus.get('player_id', null);
                return playerId ? `${link}?id=${playerId}` : link;
            }
            return link;
        };

        checklist = Object.values(checklist).map((task) => {
            const $rows = task.subtasks.map((subtask) => {
                const $title = $('<strong>')
                    .addClass('item-title')
                    .text(subtask.title);

                const $img = $('<img>')
                    .addClass('itemimgsm')
                    .attr('src', subtask.icon);
                
                return $('<a>')
                    .addClass('row no-gutter').css({ marginBottom: '5px' })
                    .attr('href', fixLink(subtask.link))
                    .append([
                        $('<div>').addClass('col-30').append($img),
                        $('<div>').addClass('col-70').append($title)
                    ]);
            });

            $rows[0].css('marginTop', '10px');

            const $completeButton = $('<button>')
                .addClass('button btnsmall btngreen')
                .css({ marginLeft: 'auto', marginRight: 'auto', marginTop: '10px' })
                .text('Complete')
                .on('click', () => {
                    completedTasks[task.configName] = true;
                    StoragePlus.set('checklist_storage', completedTasks);

                    const $col = $checklistGrid.find(`#frpgp-checklist-${task.configName}`);
                    const $parent = $col.parent();
                    const $grandParent = $parent.parent();

                    $col.remove();

                    if ($parent.children().length === 0) {
                        $parent.remove();
                    } else if ($parent.children().length > 0) {
                        this._rebalanceRows($parent);
                    }

                    if ($grandParent.children().length === 0) {
                        $grandParent.append([
                            $('<i>').addClass('fa fa-fw fa-check').css({ color: isDarkMode() ? 'lightGreen' : 'green', fontSize: '24px' }),
                            $('<strong>').css({ marginLeft: '5px', fontSize: '18px' }).text('All tasks completed for today!')
                        ]);
                    }
                });

            const $taskTitle = $('<strong>').css({ fontSize: '16px' }).append(task.title);

            const $col = $('<div>')
                .attr('id', `frpgp-checklist-${task.configName}`)
                .addClass('col')
                .css({ padding: '10px' })
                .append([
                    $taskTitle,
                    $completeButton,
                    ...$rows,
                ]);

            return $col;
        });

        if (checklist.length === 0) {
            $checklistGrid.append(
                $('<i>').addClass('fa fa-fw fa-check').css({ color: isDarkMode() ? 'lightGreen' : 'green', fontSize: '24px' }),
                $('<strong>').css({ marginLeft: '5px', fontSize: '18px' }).text('All tasks completed for today!')
            );
        } else {
            const threshold = window.innerWidth <= 450 ? 2 : 3;
            const colSize = Math.floor(100 / threshold);

            const $rows = checklist.reduce((acc, $col) => {
                const $newCol = $col.removeClass('col').addClass(`col-${colSize}`);

                if (acc.length === 0 || acc[acc.length - 1].children().length >= threshold) {
                    acc.push(
                        $('<div>')
                            .addClass('row no-gutter')
                            .css({ marginBottom: '10px' })
                            .append($newCol)
                    );
                } else {
                    acc[acc.length - 1].append($newCol);
                }
                return acc;
            }, []);

            const $lastRow = $rows[$rows.length - 1];
            if ($lastRow.children().length <= threshold) {
                const newColSize = Math.floor(100 / $lastRow.children().length);
                $lastRow.children().removeClass(`col-${colSize}`).addClass(`col-${newColSize}`);
            }

            $checklistGrid.append($rows);
        }

        const $card = $('<div>')
            .attr('id', 'frpgp-daily-checklist')
            .addClass('card')
            .append(
                $('<div>')
                    .addClass('card-content')
                    .append($checklistGrid)
            );

        const itExists = $(page.container).find('#frpgp-daily-checklist').length > 0;
        if (itExists) {
            $(page.container).find('#frpgp-daily-checklist').replaceWith($card);
        } else {
            getListByTitle(
                page,
                HomePage.titles.OTHER_STUFF,
                { returnTitle: true }
            ).before([
                '<div class="content-block-title">Daily Checklist</div>',
                $card,
            ]);
        }
    };

    announceNewUpdate = (page) => {
        throwIfPageInvalid(page, this.announceNewUpdate.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'announceNewUpdate')) {
            ConsolePlus.debug('Announcing new update is disabled in settings.');
            return;
        }
        
        const $lastUpdateList = getListByTitle(page, HomePage.titles.UPDATE).find('li');
        
        if ($lastUpdateList.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.announceNewUpdate.name,
                'Most Recent Update section not found on the home page.',
            );
        }
        
        const lastUpdateText = $lastUpdateList.find('.item-title').contents().first().text().trim();
        
        if (!lastUpdateText) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.announceNewUpdate.name,
                'No last update text found in the "Most Recent Update" section.',
            );
        }
        
        const lastUpdateSubtitle = $lastUpdateList.find('span').text().trim() || 'No subtitle found';
        
        let lastUpdate = StoragePlus.get('last_update', null);
        
        if (
            !lastUpdate ||
            lastUpdate.date !== lastUpdateText ||
            lastUpdate.subtitle !== lastUpdateSubtitle
        ) {
            lastUpdate = {
                date: lastUpdateText,
                subtitle: lastUpdateSubtitle,
                hidden: false
            };

            StoragePlus.set('last_update', lastUpdate);
        }

        if (lastUpdate.hidden) {
            return;
        }

        const highlightStyle = SettingsPlus.getValue(
            GamePagesEnum.HOME,
            'announceNewUpdate',
            'highlightStyle'
        );

        const $announceList = $lastUpdateList
            .clone();

        if (highlightStyle === 'glow') {
            $announceList.addClass('glow1');
        } else if (highlightStyle === 'border') {
            $announceList.css({ border: '2px dashed teal' });
        } else if (highlightStyle === 'background') {
            $announceList.css({ backgroundColor: 'rgba(0, 255, 255, 0.2)' });
        }

        $announceList.find('.item-title').contents().first().wrap('<strong>').end();
        
        const $announceCard = createCardList({
            title: 'New Update Available!',
            children: [$announceList],
        });

        $announceCard[0].append(
            $('<a>')
                .attr('href', '#')
                .css({ fontSize: '11px', marginLeft: '5px' })
                .text('[HIDE]')
                .on('click', (e) => {
                    e.preventDefault();
                    lastUpdate.hidden = true;
                    StoragePlus.set('last_update', lastUpdate);
                    $announceCard[0].remove();
                    $announceCard[1].remove();
                })
        );
        $announceCard[1].attr('id', 'frpgp-new-update-announcement');
        
        const itExists = $(page.container).find('#frpgp-new-update-announcement').length > 0;
        if (!itExists) {
            getListByTitle(
                page,
                HomePage.titles.HOME,
                { returnTitle: true }
            ).before($announceCard);
        }
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Index page initialized:', page);
        this.cachePlayerId(page);
        this.addBuddyFarmButton(page);
        this.hideMaxedSkills(page);
        const callback = this.highlightReadyActions(page);
        this.addDailyChecklist(page);
        this.announceNewUpdate(page);

        return callback;
    };
}

export default HomePage;
