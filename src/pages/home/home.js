import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
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
    }

    static titles = Object.freeze({
        HOME: 'Where do you want to go?',
        MY_SKILLS: 'My Skills',
        PERKS_AND_MASTERY: 'Perks, Mastery & More',
        UPDATE: 'Most Recent Update',
        OTHER_STUFF: 'Other Stuff'
    });

    addBuddyFarmButton = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addBuddyFarmButton.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled(GamePagesEnum.HOME, 'addBuddyFarmButton')) {
            ConsolePlus.log('Buddy Farm button is disabled in settings.');
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

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Index page initialized:', page);
        this.addBuddyFarmButton(page);
    };
}

export default HomePage;
