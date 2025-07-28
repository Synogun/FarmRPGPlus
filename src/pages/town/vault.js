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
 * Simula o feedback de um palpite numérico de 4 dígitos contra o código secreto.
 * @param {string} guess  - string de 4 dígitos, ex: "0123"
 * @param {string} secret - string de 4 dígitos, ex: "3021"
 * @returns {Array<{ number: string, color: 'blue'|'yellow'|'gray' }>}
 */
    simulateFeedback = (guess, secret) => {
        // transforma em arrays de chars
        const g = guess.split('');
        const s = secret.split('');

        // inicializa tudo como cinza (gray)
        const feedback = g.map(d => ({ number: d, color: 'gray' }));

        // 1) marca os verdes (blue)
        const usedInSecret = [false, false, false, false];
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                feedback[i].color = 'blue';
                usedInSecret[i] = true;
            }
        }

        // 2) conta os dígitos restantes do secreto
        const counts = {};
        for (let i = 0; i < 4; i++) {
            if (!usedInSecret[i]) {
                counts[s[i]] = (counts[s[i]] || 0) + 1;
            }
        }

        // 3) marca os amarelos (yellow) onde couber
        for (let i = 0; i < 4; i++) {
            if (feedback[i].color === 'gray') {
                const d = g[i];
                if (counts[d]) {
                    feedback[i].color = 'yellow';
                    counts[d]--;
                }
            }
        }

        return feedback;
    };

    /**
     * Make a guess for the Crack The Vault game based on previous hints
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

        const isUniqueCode = code => /^(?!.*(.).*\1)[0-9]{4}$/.test(code);

        for (let attempt = 1; attempt <= attemptsMade; attempt++) {
            const hints = attemptHints(attempt);

            for (let i = 0; i < hints.length; i++) {
                const { color, number } = hints[i];
                const index = i % 4; // Get the index in the 4-digit code

                if (color === 'blue') {
                    allCodes = allCodes.filter(code => code[index] === number);
                } else if (color === 'yellow') {
                    allCodes = allCodes.filter(code => code[index] !== number);
                } else if (color === 'gray') {
                    if (isUniqueCode(hints.map(h => h.number).join(''))) {
                        allCodes = allCodes.filter(code => !code.includes(number));
                    } else {
                        allCodes = allCodes.filter(code => code[index] !== number);
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
        } else {
            // Should never happen, but just in case
            ConsolePlus.warn('No codes available for the first guess, using default guess.');
            suggestedGuess = '4567'; // Default guess if no codes available
        }

        return suggestedGuess;
    };

    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Vault page initialized:', page);
        this.addLibraryCard(page);
        this.addGuessVaultCode(page);
    };
}

export default VaultPage;
