import $ from 'jquery';
import IconsUrlEnum from '../constants/iconsUrlEnum';
import { ItemGiftsEnum } from '../constants/npcGiftsEnum';
import NPCUrlsEnum from '../constants/npcUrlsEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import { createRow } from '../modules/rowFactory';
import { createCardList, getListByTitle, parseNameForUrl } from '../utils/utils';

class ItemPage {

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

    addNpcLikingsCards = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addNpcLikingsCards.name,
            );
            return;
        }

        const capitalizeWords = name => name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const itemName = this.getItemNameOnNavbar(page);
        

        for (const [giftPower, npcList] of Object.entries(ItemGiftsEnum[itemName] || {})) {
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

            const npcRows = npcList.map((npcName) => {
                return createRow({
                    iconImageUrl: NPCUrlsEnum[npcName]?.IMAGE || '',
                    iconUrl: IconsUrlEnum[`NPC_${giftPower}_GIFT`] || '',
                    iconOnTitleEnd: true,
                    title: capitalizeWords(npcName),
                    subtitle: `Gives: ${XPValue} XP | TFOD: ${XPValue * 2} XP`,
                    rowLink: NPCUrlsEnum[npcName]?.MAILBOX,
                    // afterLabel: $afterIcon(),
                });
            });

            const cardId = `frpg-${giftPower.toLowerCase().replace('_', '-')}-npc-likings-card`;
            const $card = createCardList({
                cardId,
                title: `NPCs Who ${capitalizeWords(giftPower)} `,
                children: npcRows,
            });
            
            const itExists = $(page.container).find(cardId).length > 0;

            if (this.doesItemHaveMastery(page) && !itExists) {
                getListByTitle(page, ItemPage.titles.ITEM_DETAILS, { returnTitle: true })
                    .next() // Title -> Card
                    .next() // Card -> Track Mastery Button
                    .after($card);
            } else if (!itExists) {
                getListByTitle(page, ItemPage.titles.ITEM_DETAILS, { returnTitle: true })
                    .next() // Title -> Card
                    .after($card);
            }
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
    };
}

export default ItemPage;


