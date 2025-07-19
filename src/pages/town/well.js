import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { createCardList, getListByTitle } from '../../utils/utils';

class WellPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.WELL, {
            displayName: 'Wishing Well',
            order: 100,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.WELL,
            'addLibraryCard',
            {
                title: 'Add Library Card?',
                subtitle: 'Adds a card with links to helpful Wishing Well Library pages.',
                enabledByDefault: true,
                configs: {}
            }
        );
    }

    static titles = Object.freeze({
        ABOUT_THE_WISHING_WELL: 'About the Wishing Well',
        TOSS_SOMETHING_IN: 'Toss something in'
    });

    addLibraryCard = (page) => {
        throwIfPageInvalid(page, this.addLibraryCard.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.WELL, 'addLibraryCard')) {
            ConsolePlus.log('Wishing Well Library card is disabled in settings.');
            return;
        }

        const $wwTipsRow = createRow({
            rowId: 'frpgp-wishing-well-tips',
            iconClass: 'fa fa-fw fa-lightbulb',
            title: 'Library - Wishing Well Tips',
            subtitle: 'Open\'s Wishing Well Tips Library page',
            rowLink: 'wiki.php?page=Wishing+Well+Tips',
        });

        const $wwCuriosRow = createRow({
            rowId: 'frpgp-wishing-well-curios',
            iconClass: 'fa fa-fw fa-search',
            title: 'Library - Wishing Well Curios',
            subtitle: 'Open\'s Wishing Well Curios Library page',
            rowLink: 'wiki.php?page=Wishing+Well+Curios',
        });

        const $wwWantsRow = createRow({
            rowId: 'frpgp-ww-wants',
            iconClass: 'fa fa-fw fa-gift',
            title: 'Library - WW Wants',
            subtitle: 'Open\'s WW Wants Library page',
            rowLink: 'wiki.php?page=WW Wants',
        });

        const $libraryCard = createCardList({
            cardId: 'frpgp-wishing-well-library-card',
            title: 'Wishing Well Library',
            children: [$wwTipsRow, $wwCuriosRow, $wwWantsRow],
        });

        const $lastTitle = getListByTitle(
            page,
            WellPage.titles.TOSS_SOMETHING_IN,
            { returnTitle: true },
        );

        const itExists = $(page.container).find('#frpgp-wishing-well-library-card').length > 0;
        if (!itExists) {
            $lastTitle.next('.card').after($libraryCard);
        }
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Well page initialized:', page);
        this.addLibraryCard(page);
    };
}

export default WellPage;
