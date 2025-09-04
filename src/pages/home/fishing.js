import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import SettingsPlus from '../../modules/settingsPlus';

class FishingPage {
    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.FISHING, {
            displayName: 'Fishing Page',
            order: 100,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.FISHING,
            'fishOnCenter',
            {
                title: 'Fish on Center',
                subtitle: 'Displays the fish caught in the center area.',
                enabledByDefault: true,
                configs: {}
            }
        );
    }

    addFishOnCenter = (page) => {
        throwIfPageInvalid(page, this.addFishOnCenter.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.FISHING, 'fishOnCenter')) {
            ConsolePlus.warn('Fish on Center feature is disabled');
            return;
        }

        const style = $('<style>')
            .attr('id', 'frpg-fish-on-center')
            .text(`
                .fish {
                    position: absolute;
                    top: calc(50% - 30px);
                    left: calc(50% - 30px);
                }
            `);

        const exists = $('#frpg-fish-on-center').length > 0;
        if (!exists) {
            $('head').append(style);
        }

        return () => {
            ConsolePlus.debug('Removing Fish on Center styles');
            $('#frpg-fish-on-center').remove();
        };
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Fishing page initialized', page);
        const callback = this.addFishOnCenter(page);

        return callback;
    };
}

export default FishingPage;
