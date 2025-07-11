import $ from 'jquery';
import IconsUrlEnum from '../constants/iconsUrlEnum';
import { ErrorTypesEnum, FarmRPGPlusError } from '../FarmRPGPlusError';
import ConsolePlus from '../modules/consolePlus';
import { createRow } from '../modules/rowFactory';
import { getListByTitle } from '../utils/utils';

class HomePage {

    static titles = Object.freeze({
        HOME: 'Where do you want to go?',
        MY_SKILLS: 'My Skills',
        PERKS_AND_MASTERY: 'Perks, Mastery & More',
        UPDATE: 'Most Recent Update',
        OTHER_STUFF: 'Other Stuff'
    });

    addBuddyFarmButton = (page) => {
        // Example item row
        /**
        <div class="item-content">
            <div class="item-media">
                <img class="itemimg" src="/img/items/map.png">
            </div>
            <div class="item-inner">
                <div class="item-title">
                    XP Value
                    <br>
                    <span style="font-size: 11px">XP gained to Skill</span>
                </div>
                <div class="item-after">
                    5,000 XP
                </div>
            </div>
        </div>
        */

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
