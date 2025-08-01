import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { createCardList } from '../../utils/utils';

class QuestsPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.HELP_NEEDED, {
            displayName: 'Quests Page',
            order: 4,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.HELP_NEEDED,
            'addBuddyFarmButton',
            {
                title: 'Add Buddy Farm Button?',
                subtitle: 'Adds a button that links to the Buddy Farm Quests page.',
                enabledByDefault: true,
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
        throwIfPageInvalid(page, this.addBuddyFarmCard.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.HELP_NEEDED, 'addBuddyFarmButton')) {
            ConsolePlus.debug('Buddy Farm button is disabled in settings.');
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
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Quests page initialized:', page);
        this.addBuddyFarmCard(page);
    };
}

export default QuestsPage;
