import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import IconsUrlEnum from '../../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
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
    }

    static titles = Object.freeze({
        HOME: 'Where do you want to go?',
        MY_SKILLS: 'My skills',
        PERKS_AND_MASTERY: 'Perks, Mastery & More',
        UPDATE: 'Most Recent Update',
        OTHER_STUFF: 'Other Stuff'
    });

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

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Index page initialized:', page);
        this.addBuddyFarmButton(page);
        this.hideMaxedSkills(page);
    };
}

export default HomePage;
