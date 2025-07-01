import NPCUrlsEnum from '../constants/npcUrlsEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import { createRow } from '../modules/rowFactory';
import { createCardList } from '../utils/utils';

class NPCSPage {

    static titles = Object.freeze({
        CURRENT_LEVELS: 'Current Levels',
        DRINK_BABA_COLA: 'Drink Baba Cola'
    });

    addTownsfolkInfoCard = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PARAMETER_MISMATCH,
                this.addTownsfolkInfoCard.name,
            );
        }

        const $townsfolkFriendshipRow = createRow({
            title: 'Library - Townsfolk Friendship',
            iconClass: 'fa fa-fw fa-heart',
            subtitle: 'Open\'s the Townsfolk Friendship Library page',
            rowLink: NPCUrlsEnum.TOWNSFOLK.FRIENDSHIP,
            rowId: 'frpgp-townsfolk-friendship-row',
        });

        const $giftsRow = createRow({
            title: 'Library - Townsfolk Gifts',
            iconClass: 'fa fa-fw fa-gift',
            subtitle: 'Open\'s the Townsfolk Gifts Library page',
            rowLink: NPCUrlsEnum.TOWNSFOLK.GIFTS,
            rowId: 'frpgp-townsfolk-gifts-row',
        });

        const $bfTownsfolkRow = createRow({
            title: 'Buddy Farm - Townsfolk',
            iconClass: 'fa fa-fw fa-users',
            subtitle: 'Open\'s Buddy Farm Townsfolk page',
            rowLink: NPCUrlsEnum.TOWNSFOLK.BUDDY_FARM,
            rowId: 'frpgp-buddy-farm-townsfolk-row',
        });

        const $townsfolkInfoCard = createCardList({
            cardId: 'frpgp-townsfolk-info-card',
            title: 'Townsfolk Info',
            children: [$townsfolkFriendshipRow, $giftsRow, $bfTownsfolkRow],
        });

        const itExists = $(page.container).find('#frpgp-townsfolk-info-card');
        if (itExists.length > 0) {
            itExists.remove();
        }
        
        $(page.container).find('.card').last().after($townsfolkInfoCard);
    };

    apply = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.apply.name,
            );
        }

        ConsolePlus.log('NPCs page initialized:', page);
        this.addTownsfolkInfoCard(page);
    };
}

export default NPCSPage;
