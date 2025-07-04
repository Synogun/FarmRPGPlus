import fetch from 'node-fetch';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import { createRow } from '../modules/rowFactory';
import StoragePlus from '../modules/storagePlus';
import Roman from '../utils/roman';
import { createCardList, getListByTitle, parseNameForUrl } from '../utils/utils';

class QuestPage {
    static titles = {
        SILVER_REQUESTED: 'Silver Requested',
        ITEMS_REQUESTED: 'Items Requested',
        REWARDS: 'Rewards',
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

    addBuddyFarmCard = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addBuddyFarmCard.name,
            );
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
        
        const pageIsPhr = this.isPhrQuestPage(page);
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

        let overrideData = {
            title: null,
            iconClass: null,
            subtitle: null,
            rowLink: null,
        };

        if (pageIsPhr) {
            overrideData.iconClass = 'fa fa-fw fa-book';
            overrideData.title = 'Library - Personal Help Requests';
            overrideData.subtitle = 'Open\'s library personal help requests page';
            overrideData.rowLink = 'wiki.php?page=Personal+Help+Requests';
        }

        const $bfCurrentQuestRow = createRow({
            rowId: 'frpgp-buddy-farm-current-quest',
            title: overrideData.title ?? `BF - ${questName}`,
            iconClass: overrideData.iconClass ?? 'fa fa-fw fa-bullseye',
            subtitle: overrideData.subtitle ?? 'Open\'s Buddy Farm current quest page',
            rowLink: overrideData.rowLink ?? `https://buddy.farm/q/${parseNameForUrl(questName)}`,
        });

        const $bfCard = createCardList({
            cardId: 'frpgp-buddy-farm-quest-info-card',
            title: 'Quest Information',
            children: [$bfCurrentQuestRow],
        });

        const $lastTitle = getListByTitle(
            page,
            QuestPage.titles.REWARDS,
            { returnTitle: true },
        );

        const itExists = $(page.container).find('#frpgp-buddy-farm-quest-info-card');
        if (itExists.length > 0) {
            itExists.remove();
        }

        $lastTitle.next('.card').after($bfCard);
    };

    addExtraBuddyFarmButtons = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addExtraBuddyFarmButtons.name,
            );
            return;
        }

        const pageIsPhr = this.isPhrQuestPage(page);
        
        if (pageIsPhr) {
            return; // Skip next quest check for PHR pages
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

        const [previousQuestNumber, nextQuestNumber] = this.getPreviousAndNextQuestNumbers(questName);

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

            $(page.container).find('#frpgp-buddy-farm-current-quest').parent().before($previousQuestRow);
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

                $(page.container).find('#frpgp-buddy-farm-current-quest').parent().after($nextQuestRow);

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
        this.addBuddyFarmCard(page);
        this.addExtraBuddyFarmButtons(page);
    };
}

export default QuestPage;
