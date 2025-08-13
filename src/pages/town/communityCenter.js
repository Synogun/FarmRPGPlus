import $ from 'jquery';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';

class CommunityCenterPage {

    sendOnEnter = (page) => {
        throwIfPageInvalid(page, this.sendOnEnter.name);

        const $donateInput = $(page.container).find('input.itemamt');

        if ($donateInput.length <= 0) {
            ConsolePlus.warn('Donate input field not found on Community Center page.');
            return;
        }
        const $donateButton = $(page.container).find('button.donatebtn');

        if ($donateButton.length <= 0) {
            ConsolePlus.warn('Donate button not found on Community Center page.');
            return;
        }

        $donateInput.on('keyup', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const amount = $(this).val().trim();
                if (amount) {
                    $donateButton.trigger('click');
                } else {
                    ConsolePlus.warn('No amount entered for donation.');
                    return;
                }
            }
        });
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Community Center page initialized:', page);
        this.sendOnEnter(page);
        // Additional features can be registered here

    };
}

export default CommunityCenterPage;
