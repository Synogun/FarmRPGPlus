import $ from 'jquery';
import GamePagesEnum from '../../constants/gamePagesEnum';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import { createCardList, getListByTitle } from '../../utils/utils';

class VaultPage {

    constructor(isToRegister = true) {
        if (!isToRegister) {
            return;
        }

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

        SettingsPlus.registerFeature(
            GamePagesEnum.VAULT,
            'addEnterHotkeys',
            {
                title: 'Add Enter Hotkeys?',
                subtitle: 'Enables enter key hotkey for sending and guessing the vault code.',
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
            ConsolePlus.debug('Vault Library card is disabled in settings.');
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

    /**
     * Extracts vault hints from the given page's DOM.
     *
     * @param {Object} page - The page object containing a `container` property with the DOM element.
     * @returns {Array<{color: string, number: string}>} An array of hint objects, each with a `color` and `number` property.
     * @throws {Error} If the provided page is invalid.
     */
    getVaultHints = (page) => {
        throwIfPageInvalid(page, this.getVaultHints.name);

        const $vaultHints = $(page.container).find('.card-content-inner .row .col-25');
        if (!$vaultHints.length) {
            return [];
        }

        return $vaultHints
            .map((_, hint) => $(hint).text().trim()).get()
            .reduce((acc, hint) => {
                const hintParts = hint.match(/([a-zA-Z]+)(\d+)/).slice(1);
                if (hintParts) {
                    const [color, number] = hintParts;
                    acc.push({ color, number });
                }
                return acc;
            }, []);
    };

    addGuessVaultCode = (page) => {
        throwIfPageInvalid(page, this.addGuessVaultCode.name);

        if (!SettingsPlus.isEnabled(GamePagesEnum.VAULT, 'addGuessVaultCode')) {
            ConsolePlus.debug('Vault Guess Code button is disabled in settings.');
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
        const $guessVaultCodeButton = $('<a>')
            .attr('id', 'frpgp-vault-guess-code-button')
            .addClass('button btn btnblue')
            .text('Guess Vault Code');

        const $inputVaultCode = $(page.container).find('#vaultcode');

        $guessVaultCodeButton.on('click', (evt) => {
            evt.preventDefault();

            if (!$inputVaultCode.length) {
                throw new FarmRPGPlusError(
                    ErrorTypesEnum.ELEMENT_NOT_FOUND,
                    this.addGuessVaultCode.name,
                    'Vault code input not found in the page container.'
                );
            }

            const vaultHints = this.getVaultHints(page);

            if (!vaultHints.length) {
                $inputVaultCode.val('0123');
                $inputVaultCode.trigger('focus');
                return; // No hints available, default to '0123'
            }

            $inputVaultCode.val(
                this.guessVaultCode(vaultHints)
            );
            $inputVaultCode.trigger('focus');
        });

        const newVaultButtonExists = $(page.container).find('.resetbtn').length > 0;
        const itExists = $(page.container).find('#frpgp-vault-guess-code-button').length > 0;
        
        if (!itExists && !newVaultButtonExists) {
            $(page.container).find('a.vcbtn').after($guessVaultCodeButton);
        }
    };

    /**
     * Make a guess for the Crack The Vault game based on previous guesses and feedback.
     * @param {Array<{ color: string, number: string}>} hintList - Previous guesses and their feedback
     * @returns {string} - The next 4-digit guess
    */
    guessVaultCode = (hintList) => {
        if (!hintList || hintList.length === 0) {
            return '0123'; // Default first guess
        }

        const attemptsMade = hintList.length / 4;
        const attemptHints = (attempt = 0) => {
            if (attempt < 1 || attempt > attemptsMade) {
                throw new FarmRPGPlusError(
                    ErrorTypesEnum.INVALID_ARGUMENT,
                    this.guessVaultCode.name,
                    `Invalid attempt number: ${attempt}. Must be between 1 and ${attemptsMade}.`
                );
            }

            return hintList.slice((attempt - 1) * 4, attempt * 4);
        };

        let allCodes = [];
        for (let i = 1; i < 10000; i++) {
            allCodes.push(i.toString().padStart(4, '0'));
        }

        const knownDigits = new Set;
        const unknownDigits = new Set([...Array(10).keys()].map(String));
        
        const correctCode = ['', '', '', ''];
        const maybeCode = ['', '', '', ''];

        const isUniqueCode = code => /^(?!.*(.).*\1)[0-9]{4}$/.test(code);
        
        /**
         * Attempts to inject a given digit into the guess at a position marked as 'blue' (correct digit and position),
         * but only if the code is not yet complete. This helps test unknown digits in known correct positions.
         * If no position is available or the code is complete, returns the original guess.
         *
         * @param {string} guess - The current 4-digit guess.
         * @param {string} digit - The digit to inject into the guess.
         * @returns {string} - The modified guess with the digit injected, or the original guess if not possible.
         */
        const injectDigitOnBlue = (guess, digit) => {
            const currentGuess = guess.split('');
            const itsComplete = (correctCode.filter(d => d !== '').length + maybeCode.filter(d => d !== '').length) === 4;
            const indexToInject = currentGuess.findIndex(
                (d, index) =>
                    correctCode[index] !== '' &&
                    d === correctCode[index] // Only inject if the position is not already injected
            );

            if (indexToInject !== -1 && !itsComplete) {
                currentGuess[indexToInject] = digit;

                return currentGuess.join('');
            } else {
                return guess; // No position available, return original guess
            }
        };

        for (let attempt = 1; attempt <= attemptsMade; attempt++) {
            const hints = attemptHints(attempt);

            for (let i = 0; i < hints.length; i++) {
                const { color, number: digit } = hints[i];
                const index = i % 4;

                if (!knownDigits.has(digit)) {
                    knownDigits.add(digit);
                    unknownDigits.delete(digit);
                }

                if (color === 'blue') {
                    allCodes = allCodes.filter(code => code[index] === digit);

                    correctCode[index] = digit;
                    maybeCode[index] = '';
                } else if (color === 'yellow') {
                    allCodes = allCodes.filter(code => code[index] !== digit && code.includes(digit));
                    maybeCode[index] = digit;
                } else if (color === 'gray') {
                    if (isUniqueCode(hints.map(h => h.number).join(''))) {
                        allCodes = allCodes.filter(code => !code.includes(digit));
                    } else {
                        allCodes = allCodes.filter(code => code[index] !== digit);
                    }
                }
            }
        }

        let suggestedGuess;
        if (allCodes.length > 0) {
            const uniqueCodes = allCodes.filter(isUniqueCode);
            if (uniqueCodes.length > 0) {
                const randomIndex = Math.floor(Math.random() * uniqueCodes.length);
                suggestedGuess = uniqueCodes[randomIndex];
            } else {
                const randomIndex = Math.floor(Math.random() * allCodes.length);
                suggestedGuess = allCodes[randomIndex];
            }

            if (unknownDigits.size > 0) {
                for (const digit of unknownDigits) {
                    if (suggestedGuess.includes(digit) || correctCode.includes(digit)) {
                        continue;
                    }
                    suggestedGuess = injectDigitOnBlue(suggestedGuess, digit);
                }
            }
        } else {
            // Should never happen, but just in case
            ConsolePlus.warn('No codes available for the first guess, using default guess.');
            suggestedGuess = '4567';
        }

        return suggestedGuess;
    };

    addEnterHotkeys = (page) => {
        throwIfPageInvalid(page, this.addEnterHotkeys.name);

        const $inputVaultCode = $(page.container).find('#vaultcode');
        const isAddGuessVaultCodeEnabled = SettingsPlus.isEnabled(GamePagesEnum.VAULT, 'addGuessVaultCode');

        $inputVaultCode.on('keyup.frpgplus', (event) => {
            if (event.key === 'Enter') {
                const $sendButton = $(page.container).find('a.vcbtn');
                
                if (!$sendButton.length) {
                    ConsolePlus.warn('Send button not found');
                    return;
                }

                ConsolePlus.log('Sending vault guess:', $inputVaultCode.val());
                if ($inputVaultCode.val() && $inputVaultCode.val().length === 4) {
                    $sendButton[0].click();
                    $inputVaultCode.off('keyup.frpgplus');
                } else if ($inputVaultCode.val().length === 0 && isAddGuessVaultCodeEnabled) {
                    const vaultHints = this.getVaultHints(page);
                    $inputVaultCode.val(
                        this.guessVaultCode(vaultHints)
                    );
                }
            }
        });
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Vault page initialized:', page);
        this.addLibraryCard(page);
        this.addGuessVaultCode(page);
        this.addEnterHotkeys(page);
    };
}

export default VaultPage;
