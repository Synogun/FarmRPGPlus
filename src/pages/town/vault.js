import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { createCardList, getListByTitle } from '../../utils/utils';

class VaultPage {

    constructor() {
        SettingsPlus.registerPage(GamePagesEnum.VAULT, {
            displayName: 'Vault',
            order: 100,
        });

        SettingsPlus.registerFeature(
            GamePagesEnum.VAULT,
            'addLibraryCard',
            {
                title: 'Add Library Card?',
                subtitle: 'Adds a card with a link to the Vault Library page.',
                enabledByDefault: true,
                configs: {}
            }
        );

        SettingsPlus.registerFeature(
            GamePagesEnum.VAULT,
            'addGuessVaultCode',
            {
                title: 'Add Guess Vault Code Button?',
                subtitle: 'Enables the Guess Vault Code button.',
                enabledByDefault: true,
                configs: {}
            }
        );
    }

    static titles = Object.freeze({
        VAULT_STATS: 'Vault Stats',
        BORGEN_BUCKS: 'Borgen Bucks',
        LUCKY_SEVENS: 'All Lucky 7\'s Today'
    });

    addLibraryCard = (page) => {
        throwIfPageInvalid(page, this.addLibraryCard.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.VAULT, 'addLibraryCard')) {
            ConsolePlus.log('Vault Library card is disabled in settings.');
            return;
        }

        const $vaultLibraryRow = createRow({
            rowId: 'frpgp-vault-library',
            iconClass: 'fa fa-fw fa-book',
            title: 'Library - Vault Library',
            subtitle: 'Open\'s Vault Library page',
            rowLink: 'wiki.php?page=The+Vault',
        });

        const $libraryCard = createCardList({
            cardId: 'frpgp-vault-library-card',
            title: 'Vault Library',
            children: [$vaultLibraryRow],
        });

        const itExists = $(page.container).find('#frpgp-vault-library-card').length > 0;
        if (!itExists) {
            getListByTitle(
                page,
                VaultPage.titles.BORGEN_BUCKS,
                { returnTitle: true },
            ).before($libraryCard);
        }
    };

    addGuessVaultCode = (page) => {
        throwIfPageInvalid(page, this.addGuessVaultCode.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.VAULT, 'addGuessVaultCode')) {
            ConsolePlus.log('Vault Guess Code button is disabled in settings.');
            return;
        }

        /*
        Crack The Vault code and win Silver!
        Blue means you guessed a correct digit in the correct position.
        Yellow means you guessed a correct digit in the wrong position.
        Code is 4-digit (0001-9999). You have 4 tries left.

        IMPORTANT! 0 is a valid number and potentially part of the code.
        Also, the same number could be in the code more than once.
        */

        const $inputVaultCode = $(page.container).find('#vaultcode');

        const $guessVaultCodeButton = $('<a>')
            .attr('id', 'frpgp-vault-guess-code-button')
            .addClass('button btn btnblue')
            .text('Guess Vault Code');

        $guessVaultCodeButton.on('click', (evt) => {
            evt.preventDefault();

            if (!$inputVaultCode.length) {
                throw new FarmRPGPlusError(
                    ErrorTypesEnum.ELEMENT_NOT_FOUND,
                    this.addGuessVaultCode.name,
                    'Vault code input not found in the page container.'
                );
            }

            const $vaultHints = $(page.container).find('.card-content-inner .row .col-25');

            if (!$vaultHints.length) {
                $inputVaultCode.val('0123');
                return; // No hints available, default to '0123'
            }

            const vaultHints = $vaultHints
                .map((_, hint) => $(hint).text().trim()).get()
                .reduce((acc, hint) => {
                    const hintParts = hint.match(/([a-zA-Z]+)(\d+)/).slice(1);
                    if (hintParts) {
                        const [color, number] = hintParts;
                        acc.push({ color, number });
                    }
                    return acc;
                }, []);
    
            console.log('Vault hints:', vaultHints);

            $inputVaultCode.val(
                this.guessVaultCode(vaultHints)
            );
        });

        const newVaultButtonExists = $(page.container).find('.resetbtn').length > 0;
        const itExists = $(page.container).find('#frpgp-vault-guess-code-button').length > 0;
        
        if (!itExists && !newVaultButtonExists) {
            $(page.container).find('a.vcbtn').after($guessVaultCodeButton);
        }
    };

    /**
     * Make a guess for the Crack The Vault game based on previous hints
     * @param {Array<T>} hintList - Previous guesses and their feedback
     * @returns {string} - The next 4-digit guess
    */
    guessVaultCode = (hintList) => {
        // TODO: Implement a more sophisticated algorithm to analyze hints and make better guesses
        if (!hintList || hintList.length === 0) {
            return '0123'; // Default first guess
        }

        const attemptsMade = hintList.length / 4;
        const suggestedGuess = [];

        if (attemptsMade === 1) {
            suggestedGuess.push('4', '5', '6', '7');
        } else if (attemptsMade === 2) {
            suggestedGuess.push('8', '9');
        }

        return suggestedGuess.join('');
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Vault page initialized:', page);
        this.addLibraryCard(page);
        this.addGuessVaultCode(page);
    };
}

export default VaultPage;
