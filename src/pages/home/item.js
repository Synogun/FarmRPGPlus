import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ItemGiftsEnum } from '../../constants/npcGiftsEnum';
import NPCUrlsEnum from '../../constants/npcUrlsEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';
import { createCardList, getListByTitle, parseNameForUrl } from '../../utils/utils';
import MasteryTiersEnum, { MasteryTiersDisplayEnum } from '../../constants/masteryTiersEnum';

class ItemPage {
    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.ITEM, {
            displayName: 'Item Page',
            order: 3
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.ITEM,
            'addBuddyFarmButton',
            {
                title: 'Add Buddy Farm Button?',
                subtitle: 'Adds a button that links to Buddy Farm page of the item.',
                isEnabled: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.ITEM,
            'addNpcLikingsCards',
            {
                title: 'Add NPC Likings Cards?',
                subtitle: 'Adds cards showing which NPCs super love, love, like or hate the current item.',
                isEnabled: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.ITEM,
            'addCollectedIndicator',
            {
                title: 'Add Collected Indicator?',
                subtitle: [
                    'Adds an indicator showing if the item was already collected at some point of the game.',
                    '<br>',
                    'Synchronizes whenever entering on Inventory, Item or Museum pages.',
                ],
                isEnabled: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.ITEM,
            'addPJToGoalIndicator',
            {
                title: 'Add Pumpkin Juice Goal Indicator?',
                subtitle: 'Adds an indicator showing the amount of Pumpkin Juice you need to reach goal.',
                isEnabled: true,
                configs: {}
            }
        );
    }

    /**
     * An immutable object containing title constants used throughout the item page.
     * @readonly
     * @enum {string}
     * @property {string} ITEM_DETAILS - Title for the item details section.
     * @property {string} PUMPKING_JUICE - Title for the pumpkin juice section.
     * @property {string} COOKING_RECIPE - Title for the cooking recipe section.
     * @property {string} COOKING_USE - Title for the cooking use section.
     * @property {string} CRAFTING_RECIPE - Title for the crafting recipe section.
     * @property {string} CRAFTING_USE - Title for the crafting use section.
     */
    static titles = Object.freeze({
        ITEM_DETAILS: 'Item Details',
        PUMPKING_JUICE: 'Pumpkin Juice',
        COOKING_RECIPE: 'Cooking Recipe',
        COOKING_USE: 'Cooking Use',
        CRAFTING_RECIPE: 'Crafting Recipe',
        CRAFTING_USE: 'Crafting Use',
        FISHING: 'Fishing',
        EXPLORING: 'Exploring',
    });

    /**
     * Determines if the given page represents a food item page by checking for the presence
     * of a specific "use multiple items" button within the page's container.
     *
     * @param {Object} page - The page object to check.
     * @param {HTMLElement} page.container - The DOM element representing the page's container.
     * @returns {boolean} True if the page contains the "use multiple items" button, otherwise false.
     */
    isFoodItemPage = (page) => {
        if (!page?.container) return false;

        const $useButton = $(page.container).find('.page-on-center .button.usemultitembtn');
        return $useButton.length > 0;
    };

    /**
     * Checks if the given page contains the mastery icon for an item.
     *
     * @param {Object} page - The page object containing the DOM container to search within.
     * @param {HTMLElement|string} page.container - The container element or selector to search for the mastery icon.
     * @returns {boolean} Returns true if the mastery icon is found, otherwise false.
     */
    doesItemHaveMastery = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.doesItemHaveMastery.name,
            );
            return;
        }

        const $mastery = $(page.container).find('img[src="/img/items/icon_mastery2.png?1"]');
        return $mastery.length > 0;
    };

    /**
     * Retrieves the current mastery amount for an item from the given page object.
     *
     * @param {Object} page - The page object containing the item information.
     * @returns {number} The current mastery amount for the item, or 0 if not found or on error.
     */
    getItemMasteryAmount = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.getItemMasteryAmount.name,
            );
            return 0;
        }

        const $mastery = $(page.container).find('.item-title span:contains(\'Progress\')');
        if ($mastery.length === 0) {
            return 0;
        }

        const masteryText = $mastery.text();
        const match = masteryText.match(/([0-9,]+) \/ ([0-9,]+) Progress/);

        if (match && match[1]) {
            return parseInt(match[1].replace(/,/g, ''), 10);
        }
        
        return 0;
    };

    /**
     * Retrieves the item name displayed in the navbar from the given page object.
     *
     * @param {Object} page - The page object containing the navbarInnerContainer property.
     * @param {HTMLElement|string} page.navbarInnerContainer - The container element or selector for the navbar.
     * @returns {string} The trimmed item name found in the navbar.
     * @throws {FarmRPGPlusError} If the page or the required element is not found.
     */
    getItemNameOnNavbar = (page) => {
        if (!page?.navbarInnerContainer) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.getItemNameOnNavbar.name,
            );
            return;
        }

        const itemName = $(page.navbarInnerContainer).find('a.sharelink').text();
        
        if (!itemName || itemName.trim() === '') {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.getItemNameOnNavbar.name,
            );
            return;
        }

        return itemName.trim();
    };

    /**
     * Retrieves the quantity of a specific item based on its name.
     *
     * @param {string} itemName - The name of the item to check.
     * @returns {number} The quantity of the item, or 0 if the item is not found.
     * @throws {FarmRPGPlusError} If the item name is not provided or is empty.
     */
    getItemQuantity = (page, { storehouse = false } = {}) => {
        if (!page || !page.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.INVALID_PARAMETER,
                this.getItemQuantity.name,
            );
            return 0;
        }

        const [whole, onHand, inStorehouse] = $(page.container)
            .find('.item-title:contains(\'My Inventory\')')
            .children('span')
            .text()
            .match(/([0-9,]+ on hand)([0-9,]+ in Storehouse)?/);

        if (!whole || !onHand) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.getItemQuantity.name,
            );
            return 0;
        
        } else if (storehouse && !inStorehouse) {
            return 0;
        }

        let quantity = parseInt(onHand.replace(/[^0-9]/g, ''), 10) || 0;
        
        if (storehouse) {
            quantity = parseInt(inStorehouse.replace(/[^0-9]/g, ''), 10) || 0;
        }

        return quantity;
    };

    /**
     * Adds a "Buddy Farm" button to the item details page.
     *
     * This button, when clicked, opens the corresponding Buddy Farm item page in a new browser tab.
     *
     * @param {Object} page - The page object containing the container and item details list.
     * @throws {FarmRPGPlusError} If the page or its container is not found.
     */
    addBuddyFarmButton = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addBuddyFarmButton.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.ITEM, 'addBuddyFarmButton')) {
            ConsolePlus.log('Buddy Farm button is disabled in settings.');
            return;
        }

        const $li = createRow({
            iconImageUrl: IconsUrlEnum.BUDDY_FARM,
            title: 'Buddy Farm',
            subtitle: 'Open\'s Buddy Farm Item Page',
            buttonLabel: 'Open',
            rowId: 'frpgp-item-buddy-farm-row',
            onClick: () => {
                const itemName = this.getItemNameOnNavbar(page);
                const url = `https://buddy.farm/i/${parseNameForUrl(itemName)}`;
                window.open(url, '_blank');
            },
        });

        const itExists = $(page.container).find('#frpgp-item-buddy-farm-row').length > 0;
        if (!itExists) {
            getListByTitle(page, ItemPage.titles.ITEM_DETAILS).prepend($li);
        }
    };

    /**
     * Adds NPC likings cards to the given page, displaying which NPCs like, love, or super love the current item,
     * along with the XP values for gifting. Cards are dynamically created and inserted after the item details section.
     *
     * @param {Object} page - The page object to which the NPC likings cards will be added.
     * @param {HTMLElement} page.container - The container element where cards will be inserted.
     *
     * @throws {FarmRPGPlusError} If the page or its container is not provided.
     *
     * @returns {void}
     */
    addNpcLikingsCards = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addNpcLikingsCards.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.ITEM, 'addNpcLikingsCards')) {
            ConsolePlus.log('NPC likings cards are disabled in settings.');
            return;
        }

        const capitalizeWords = name => name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const itemName = this.getItemNameOnNavbar(page);

        const entries = Object.entries(ItemGiftsEnum[itemName] || {})
            .sort((a, b) => {
                const powerOrder = { SUPER_LOVES: 1, LOVES: 2, LIKES: 3, HATES: 4 };
                return (powerOrder[a[0]] || 0) - (powerOrder[b[0]] || 0);
            });

        for (const [giftPower, npcList] of entries) {
            if (!npcList || npcList.length === 0) {
                continue;
            }

            let XPValue = '';

            if (itemName === 'Bouquet of Flowers') {
                XPValue = 1_000;
            } else if (itemName === 'Heart Container') {
                XPValue = 1_000_000;
            } else {
                if (giftPower === 'SUPER_LOVES') {
                    XPValue = 10_000_000;
                } else if (giftPower === 'LOVES') {
                    XPValue = 150;
                } else if (giftPower === 'LIKES') {
                    XPValue = 100;
                } else {
                    XPValue = -50;
                }
            }

            const npcRows = npcList.map(
                npcName => createRow({
                    iconImageUrl: NPCUrlsEnum[npcName]?.IMAGE || '',
                    iconUrl: IconsUrlEnum[`NPC_${giftPower}_GIFT`] || '',
                    iconOnTitleEnd: true,
                    title: capitalizeWords(npcName),
                    subtitle: `Gives: ${XPValue} XP | TFOD: ${XPValue * 2} XP`,
                    rowLink: NPCUrlsEnum[npcName]?.MAILBOX,
                })
            );

            const cardId = `frpg-${giftPower.toLowerCase().replace('_', '-')}-npc-likings-card`;
            const $card = createCardList({
                cardId,
                title: `NPCs Who ${capitalizeWords(giftPower)} `,
                children: npcRows,
            });
            
            const itExists = $(page.container).find(cardId).length > 0;

            if (!itExists) {
                const $last = $(page.container).find('p').first().prev();
                $last.after($card);
            }
        }
    };

    /**
     * Adds a "Collected" or "Not Collected" indicator to the item page UI.
     *
     * This method checks if the item has been collected by the user, either from cache or by checking the item quantity.
     * It updates the cache accordingly and appends a colored indicator to the page if it doesn't already exist.
     *
     * @param {Object} page - The page object containing the container element and item information.
     * @returns {void}
     */
    addCollectedIndicator = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addCollectedIndicator.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.ITEM, 'addCollectedIndicator')) {
            ConsolePlus.log('Collected indicator is disabled in settings.');
            return;
        }

        let cache = StoragePlus.get('items_collected_cache');
        if (!cache || typeof cache !== 'object') {
            StoragePlus.set('items_collected_cache', {});
            cache = {};
        }

        const itemName = this.getItemNameOnNavbar(page);

        let isCollected = cache[itemName] ||
            this.getItemQuantity(page) > 0 ||
            this.getItemQuantity(page, { storehouse: true }) > 0;


        const $collectedIndicator = $('<span>')
            .attr('id', 'frpgp-collected-indicator')
            .css('font-weight', 'bold')
            .css('font-size', '11px');
        
        if (isCollected) {
            $collectedIndicator
                .css('color', 'green')
                .text('Collected!');

            cache[itemName] = true;
        } else {
            $collectedIndicator
                .css('color', 'red')
                .text('Not Collected');
        }
        
        StoragePlus.set('items_collected_cache', cache);
        const itExists = $(page.container).find('#frpgp-collected-indicator').length > 0;
        
        if (!itExists) {
            $(page.container).find('div#img').append([$collectedIndicator, '<br>']);
        }
    };

    /**
     * Adds a Pumpkin Juice (PJ) goal indicator to the item page if applicable.
     *
     * This function checks if the current page contains the Pumpkin Juice section and button,
     * verifies if the feature is enabled in settings, and displays the amount of Pumpkin Juice owned.
     * It also calculates and displays the number of Pumpkin Juices needed to reach the next mastery tiers,
     * unless the current mastery is already at or above Mega Mastery.
     *
     * @param {Object} page - The page object containing the DOM container and item data.
     * @returns {void}
     */
    addPJToGoalIndicator = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addPJToGoalIndicator.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.ITEM, 'addPJToGoalIndicator')) {
            ConsolePlus.log('Pumpking Juice goal indicator is disabled in settings.');
            return;
        }

        if (!getListByTitle(page, ItemPage.titles.PUMPKING_JUICE)) {
            ConsolePlus.debug('Pumpking Juice section not found on the page.');
            return;
        }

        const $pumpkinJuiceButton = $(page.container).find('a.usepumpkinjuicebtn');

        if (!$pumpkinJuiceButton.length) {
            ConsolePlus.debug('Pumpkin Juice button not found.');
            return;
        }

        const pumpkinJuiceAmount = $pumpkinJuiceButton.find('.item-after').text().trim();
        if (!pumpkinJuiceAmount || pumpkinJuiceAmount === '0') {
            ConsolePlus.debug('Pumpkin Juice amount is zero or not found.');
            return;
        }

        const $ownedPJ = $('<span>')
            .attr('id', 'frpgp-pj-owned')
            .css('font-size', '11px')
            .append([
                'You own ',
                `<strong>${pumpkinJuiceAmount}</strong>`,
                ' Pumpkin Juices.',
            ]);

        const itExists = $(page.container).find('#frpgp-pj-owned').length > 0;
        if (!itExists) {
            $pumpkinJuiceButton.find('.item-title').append(['<br>', $ownedPJ]);
        }

        const currentMasteryAmount = this.getItemMasteryAmount(page);

        if (currentMasteryAmount >= MasteryTiersEnum.MEGA_MASTERY) {
            ConsolePlus.debug('Current mastery amount is already at or above Mega Mastery.');
            return;
        }

        const goals = [];

        for (const goalValue of Object.values(MasteryTiersEnum)) {
            if (goalValue <= currentMasteryAmount) {
                continue;
            }
            const pjNeeded = addCommas(Math.ceil(Math.log(goalValue / currentMasteryAmount) / Math.log(1.1)).toString());
            ConsolePlus.debug(`Goal: ${goalValue}, PJ Needed: ${pjNeeded}, Current Mastery: ${currentMasteryAmount}`);

            const goalText = `${pjNeeded} to ${MasteryTiersDisplayEnum[goalValue]}`;
            goals.push(`${goalText}`);
        }

        if (goals.length === 0) {
            ConsolePlus.debug('No mastery goals found for the current item.');
            return;
        }

        const itExistsGoals = $(page.container).find('#frpgp-pj-goals').length > 0;

        if (!itExistsGoals) {
            $pumpkinJuiceButton
                .find('.item-after')
                .addClass('frpgp-pj-goals')
                .text('')
                .append(goals.join(' | '));
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

        ConsolePlus.log('Item page initialized:', page);
        this.addBuddyFarmButton(page);
        this.addNpcLikingsCards(page);
        this.addCollectedIndicator(page);
        this.addPJToGoalIndicator(page);
    };
}

export default ItemPage;


