import $ from 'jquery';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';

/** Hidden Feature */
class SettingsColorsPage {

    increaseColorSize = (page) => {
        throwIfPageInvalid(page, this.increaseColorSize.name);

        $(page.container).find('.f7-icons').css({ fontSize: '30px', marginBottom: '5px' });
    };

    addPreviewCard = (page) => {
        throwIfPageInvalid(page, this.addPreviewCard.name);

        const playerUsername = $(document.body).find('#logged_in_username').text().trim();
        
        if (!playerUsername) {
            ConsolePlus.warn('No player username found to add preview card.');
            return;
        }

        const currentColorIcon = $(page.container).find('i:contains("check_round_fill")').clone();

        if (!currentColorIcon.length) {
            ConsolePlus.warn('No current color found to add preview card.');
            return;
        }

        const colorClass = currentColorIcon.attr('class').split(' ')[1];

        const previewCard = [
            $('<div>').addClass('content-block-title').text('Color Preview'),
            $('<div>').addClass('card').attr('id', 'frpgp-color-preview').append(
                $('<div>').addClass('card-content').append(
                    $('<div>').addClass('card-content-inner').append(
                        $('<p>').append(
                            '<strong>Current Color: </strong>',
                            currentColorIcon.attr('href', '#')
                        ),
                        $('<p>').append(
                            '<strong>Name Preview: </strong>',
                            `<strong class="${colorClass}" style='font-size: 25px;'>${playerUsername}</strong>`
                        ),
                    )
                )
            )
        ];

        const itExists = $(page.container).find('#frpgp-color-preview').length > 0;
        if (!itExists) {
            $(page.container).find('.content-block-title').first().before(previewCard);
        }
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Settings Colors page initialized:', page);
        this.increaseColorSize(page);
        this.addPreviewCard(page);
    };
}

export default SettingsColorsPage;
