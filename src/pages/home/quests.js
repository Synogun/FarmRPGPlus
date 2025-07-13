import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { createCardList } from '../../utils/utils';

class QuestsPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.QUESTS, {
            displayName: 'Quests Page',
            order: 4,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.QUESTS,
            'addBuddyFarmButton',
            {
                title: 'Add Buddy Farm Button?',
                subtitle: 'Adds a button that links to the Buddy Farm Quests page.',
                isEnabled: true,
                configs: {}
            }
        );
    }

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
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.QUESTS, 'addBuddyFarmButton')) {
            ConsolePlus.log('Buddy Farm button is disabled in settings.');
            return;
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

        const itExists = $(page.container).find('#frpgp-buddy-farm-row').length > 0;
        if (!itExists) {
            $(page.container).find('.card').last().prev().prev().after($bfCard);
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

        ConsolePlus.log('Quests page initialized:', page);
        this.addBuddyFarmCard(page);
    };
}

export default QuestsPage;
