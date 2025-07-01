import IconsUrlEnum from '../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import { createRow } from '../modules/rowFactory';
import { createCardList } from '../utils/utils';

class QuestsPage {

    static titles = Object.freeze({
        COMMUNITY_CENTER: 'Community Center',
        SPECIAL_REQUESTS: 'Special Requests ([0-9]+)',
        ACTIVE_REQUESTS: 'Active Requests ([0-9]+)',
        PERSONAL_REQUESTS: 'Personal Requests ([0-9]+)',
        REQUEST_TOTALS: 'Request Totals'
    });

    addBuddyFarmCard = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                'PAGE_NOT_FOUND',
                this.addBuddyFarmCard.name,
            );
        }

        const $bfRow = createRow({
            iconImageUrl: IconsUrlEnum.BUDDY_FARM,
            title: 'Buddy Farm',
            subtitle: 'Open\'s Buddy Farm Quests Page',
            rowLink: 'https://buddy.farm/quests/',
            rowId: 'frpgp-buddy-farm-row',
        });

        const $bfCard = createCardList({
            title: 'Buddy Farm',
            children: [$bfRow],
        });

        $(page.container).find('.card').last().prev().prev().after($bfCard);
    };

    apply = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.apply.name,
            );
        }

        ConsolePlus.log('Quests page initialized:', page);
        this.addBuddyFarmCard(page);
    };
}

export default QuestsPage;
