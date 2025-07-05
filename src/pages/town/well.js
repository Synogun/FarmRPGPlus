import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import { createCardList, getListByTitle } from '../../utils/utils';

class WellPage {

    static titles = Object.freeze({
        ABOUT_THE_WISHING_WELL: 'About the Wishing Well',
        TOSS_SOMETHING_IN: 'Toss something in'
    });

    addLibraryCard = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addLibraryCard.name,
            );
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
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Well page initialized:', page);
        this.addLibraryCard(page);
    };
}

export default WellPage;
