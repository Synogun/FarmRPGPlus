import $ from 'jquery';
import fetch from 'node-fetch';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';
import Roman from '../../utils/roman';
import { createCardList, getListByTitle, parseNameForUrl } from '../../utils/utils';

class QuestPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.QUEST, {
            displayName: 'Quest Page',
            order: 5,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.QUEST,
            'addBuddyFarmCard',
            {
                title: 'Add Buddy Farm Card?',
                subtitle: 'Adds a card with links to Buddy Farm quest information.',
                enabledByDefault: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.QUEST,
            'addExtraBuddyFarmButtons',
            {
                title: 'Add Extra Buddy Farm Buttons?',
                subtitle: 'Adds buttons for previous and next Buddy Farm quest pages.',
                enabledByDefault: true,
                configs: {}
            }
        );
        
        SettingsPlus.registerFeature(
            GamePagesEnum.QUEST,
            'addLibraryButtonToPhr',
            {
                title: 'Add Library Button to PHRs?',
                subtitle: 'Adds a button to Personal Help Request pages that links to the library.',
                enabledByDefault: true,
                configs: {}
            }
        );

    }

    static titles = {
        SILVER_REQUESTED: 'Silver Requested',
        ITEMS_REQUESTED: 'Items Requested',
        REWARDS: 'Rewards',
    };

    createBuddyFarmCardList = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.createBuddyFarmCardList.name,
            );
            return null;
        }

        let frpgpBuddyFarmCardExists = $(page.container).find('#frpgp-buddy-farm-quest-info-card').length > 0;
        let $bfCardList;

        if (!frpgpBuddyFarmCardExists) {
            let $bfCard = createCardList({
                cardId: 'frpgp-buddy-farm-quest-info-card',
                title: 'Buddy Farm Quest Information',
                children: [],
            });

            $bfCard = getListByTitle(
                page,
                QuestPage.titles.REWARDS,
                { returnTitle: true },
            )
                .next('.card')
                .after($bfCard)
                .next()
                .next();

            ConsolePlus.debug('Buddy Farm card created:', $bfCard);

            $bfCardList = $bfCard.find('ul');

            ConsolePlus.debug('Buddy Farm card list:', $bfCardList);
            
            if ($bfCardList.length === 0) {
                new FarmRPGPlusError(
                    ErrorTypesEnum.ELEMENT_NOT_FOUND,
                    this.createBuddyFarmCardList.name,
                );
                return null;
            }

        } else {
            $bfCardList = $(page.container).find('#frpgp-buddy-farm-quest-info-card ul');

            if ($bfCardList.length === 0) {
                new FarmRPGPlusError(
                    ErrorTypesEnum.ELEMENT_NOT_FOUND,
                    this.getBuddyFarmCardList.name,
                );
                return null;
            }
        }

        return $bfCardList;
    };

    checkIfNextQuestExists = (questName = '', nextQuestNumber = '') => {
        if (!questName || typeof questName !== 'string') {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.checkIfNextQuestExists.name,
            );
            return;
        }

        const currentQuestNumber = questName.split(' ').at(-1);

        if (!nextQuestNumber) {
            return Promise.reject(); // Not a valid Roman numeral
        }

        const nextQuestName = questName.replace(
            new RegExp(`\\b${currentQuestNumber}$`),
            ` ${nextQuestNumber}`
        );

        const cache = StoragePlus.get('next_quest_cache', {});

        return cache[nextQuestName]
            ? Promise.resolve(cache[nextQuestName])
            : fetch(`https://buddy.farm/q/${parseNameForUrl(nextQuestName)}`)
                .then(
                    (response) => {
                        cache[nextQuestName] = response.status === 200;
                        StoragePlus.set('next_quest_cache', cache);

                        return cache[nextQuestName];
                    },
                    () => {
                        new FarmRPGPlusError(
                            ErrorTypesEnum.NETWORK_ERROR,
                            this.checkIfNextQuestExists.name,
                        );

                        return false; // Assume no next quest if fetch fails
                    },
                )
                .catch(() => {
                    new FarmRPGPlusError(
                        ErrorTypesEnum.NETWORK_ERROR,
                        this.checkIfNextQuestExists.name,
                    );

                    return false; // Assume no next quest if fetch fails
                });
    };

    isPhrQuestPage = (page) => {
        if (!page?.container) {
            return false;
        }

        const $peachJuiceBtn = $(page.container).find('.button.btnorange.drinkpj');
        return $peachJuiceBtn.length > 0;
    };

    getPreviousAndNextQuestNumbers = (questName) => {
        if (!questName || typeof questName !== 'string') {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.getPreviousAndNextQuestNumbers.name,
            );
            return;
        }

        const currentQuestNumber = questName.split(' ').at(-1);
        const isRoman = Roman.isValid(currentQuestNumber);

        if (isRoman) {
            if (currentQuestNumber === 'I') {
                return [null, Roman.next(currentQuestNumber)];
            }

            const previousQuestNumber = Roman.prev(currentQuestNumber);
            const nextQuestNumber = Roman.next(currentQuestNumber);

            return [previousQuestNumber, nextQuestNumber];
        } else if (Number.isInteger(Number(currentQuestNumber))) {
            if (currentQuestNumber === '1') {
                return [null, '2'];
            }

            const previousQuestNumber = `${Number(currentQuestNumber) - 1}`;
            const nextQuestNumber = `${Number(currentQuestNumber) + 1}`;

            return [previousQuestNumber, nextQuestNumber];
        }

        new FarmRPGPlusError(
            ErrorTypesEnum.INVALID_QUEST_NUMBER,
            this.getPreviousAndNextQuestNumbers.name,
        );
        return;
    };

    addLibraryButtonToPhr = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addLibraryButtonToPhr.name,
            );
            return;
        }

        if (!this.isPhrQuestPage(page)) {
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.QUEST, 'addLibraryButtonToPhr')) {
            ConsolePlus.log('Library button for PHR is disabled in settings.');
            return;
        }

        const $peachJuiceBtn = $(page.container).find('.button.btnorange.drinkpj');
        if ($peachJuiceBtn.length === 0) {
            ConsolePlus.log('Not a PHR page, skipping library button addition.');
            return;
        }

        const $libraryButton = createRow({
            iconClass: 'fa fa-fw fa-book',
            title: 'Library - Personal Help Requests',
            subtitle: 'Open\'s library personal help requests page',
            rowLink: 'wiki.php?page=Personal+Help+Requests',
        });

        const $card = createCardList({
            cardId: 'frpgp-library-info-card',
            title: 'Library Information',
            children: [$libraryButton],
        });

        const $lastTitle = getListByTitle(
            page,
            QuestPage.titles.REWARDS,
            { returnTitle: true },
        );

        const itExists = $(page.container).find('#frpgp-library-info-card').length > 0;
        if (!itExists) {
            $lastTitle.next('.card').after($card);
        }
    };

    addBuddyFarmCard = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addBuddyFarmCard.name,
            );
            return;
        }

        if (this.isPhrQuestPage(page)) {
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.QUEST, 'addBuddyFarmCard')) {
            ConsolePlus.log('Buddy Farm card is disabled in settings.');
            return;
        }

        const $questTitle = $(page.container).find('.item-title[style=\'font-weight: bold\']');
        if (!$questTitle || $questTitle.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addBuddyFarmCard.name,
            );
            return;
        }
        
        const questName = $questTitle.children().length >= 1 // Check if it title its multi-row
            ? $questTitle.html().trim().replace(/<br\s*\/?>/gi, ' ') // Replace <br> tags with spaces
            : $questTitle.text().trim();


        if (!questName) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addBuddyFarmCard.name,
            );
            return;
        }

        const $bfCurrentQuestRow = createRow({
            rowId: 'frpgp-buddy-farm-current-quest',
            title: `BF - ${questName}`,
            iconClass: 'fa fa-fw fa-bullseye',
            subtitle: 'Open\'s Buddy Farm current quest page',
            rowLink: `https://buddy.farm/q/${parseNameForUrl(questName)}`,
        });

        const itExists = $(page.container).find('#frpgp-buddy-current-quest').length > 0;
        if (!itExists) {
            const $frpgpBuddyFarmCard = this.createBuddyFarmCardList(page);
            ConsolePlus.debug('Buddy Farm card for current quest:', $frpgpBuddyFarmCard);
            if ($frpgpBuddyFarmCard) {
                $frpgpBuddyFarmCard.append($bfCurrentQuestRow);
            } else {
                new FarmRPGPlusError(
                    ErrorTypesEnum.ELEMENT_NOT_FOUND,
                    this.addBuddyFarmCard.name,
                );
                return;
            }
        }
    };

    addExtraBuddyFarmButtons = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addExtraBuddyFarmButtons.name,
            );
            return;
        }

        if (this.isPhrQuestPage(page)) {
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.QUEST, 'addExtraBuddyFarmButtons')) {
            return;
        }

        const $questTitle = $(page.container).find('.item-title[style=\'font-weight: bold\']');

        if (!$questTitle?.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addExtraBuddyFarmButtons.name,
            );
            return;
        }

        const questName = $questTitle.children().length >= 1 // Check if it title its multi-row
            ? $questTitle.html().trim().replace(/<br\s*\/?>/gi, ' ') // Replace <br> tags with spaces
            : $questTitle.text().trim();

        if (!questName) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addExtraBuddyFarmButtons.name,
            );
            return;
        }

        let $previousQuestRow;
        let $nextQuestRow;

        const [
            previousQuestNumber,
            nextQuestNumber
        ] = this.getPreviousAndNextQuestNumbers(questName);

        if (previousQuestNumber) {
            const previousQuestName = questName.replace(
                new RegExp(`\\b${questName.split(' ').at(-1)}$`),
                previousQuestNumber
            );

            $previousQuestRow = createRow({
                rowId: 'frpgp-buddy-farm-previous-quest',
                iconClass: 'fa fa-fw fa-arrow-left',
                title: 'BF - Previous Quest',
                subtitle: 'Open\'s Buddy Farm previous quest page',
                rowLink: `https://buddy.farm/q/${parseNameForUrl(previousQuestName)}`,
            });

            const itExists = $(page.container).find('#frpgp-buddy-farm-previous-quest').length > 0;
            if (!itExists) {

                const $frpgpBuddyFarmCard = this.createBuddyFarmCardList(page);
                if ($frpgpBuddyFarmCard) {
                    $frpgpBuddyFarmCard.prepend($previousQuestRow);
                } else {
                    new FarmRPGPlusError(
                        ErrorTypesEnum.ELEMENT_NOT_FOUND,
                        this.addExtraBuddyFarmButtons.name,
                    );
                    return;
                }
            }
        }

        this.checkIfNextQuestExists(questName, nextQuestNumber).then(
            (exists) => {
                if (!exists) {
                    return false; // No next quest exists
                }

                const nextQuestName = questName.replace(
                    new RegExp(`\\b${questName.split(' ').at(-1)}$`),
                    ` ${nextQuestNumber}`
                );

                $nextQuestRow = createRow({
                    rowId: 'frpgp-buddy-farm-next-quest',
                    iconClass: 'fa fa-fw fa-arrow-right',
                    title: 'BF - Next Quest',
                    subtitle: 'Open\'s Buddy Farm next quest page',
                    rowLink: `https://buddy.farm/q/${parseNameForUrl(nextQuestName)}`,
                });

                const itExists = $(page.container).find('#frpgp-buddy-farm-next-quest').length > 0;
                if (!itExists) {
                    const $frpgpBuddyFarmCard = this.createBuddyFarmCardList(page);
                    ConsolePlus.debug('Buddy Farm card for next quest:', $frpgpBuddyFarmCard);
                    if ($frpgpBuddyFarmCard) {
                        $frpgpBuddyFarmCard.append($nextQuestRow);
                    } else {
                        new FarmRPGPlusError(
                            ErrorTypesEnum.ELEMENT_NOT_FOUND,
                            this.addExtraBuddyFarmButtons.name,
                        );
                        return;
                    }
                }

                return true;
            }, () => false,
        ).catch(() => false);
    };

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Quest page initialized:', page);
        this.addLibraryButtonToPhr(page);
        this.addBuddyFarmCard(page);
        this.addExtraBuddyFarmButtons(page);
    };
}

export default QuestPage;
