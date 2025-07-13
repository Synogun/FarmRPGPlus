import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import DebugPlus from '../../modules/debugPlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';
import TimeControl from '../../utils/timeControl';
import { createCardList, getListByTitle, parseNameForUrl, watchForElement } from '../../utils/utils';


class BottleRocketPage {

    constructor() {
        SettingsPlus.registerPage('eventFeatures', { displayName: 'Event Features' });
        SettingsPlus.registerFeature(
            'eventFeatures',
            'bottleRocket',
            {
                title: 'Bottle Rocket Event',
                subtitle: 'Features for the Bottle Rocket event.',
                isEnabled: true,
                enableTitle: 'Enable Bottle Rocket Event Features',
                enableSubtitle: 'Enables features related to the Bottle Rocket event.',
                configs: {
                    addStatsCards: {
                        title: 'Add Stats Cards',
                        subtitle: 'Enables a list containing statistics gathered along the event.',
                        type: 'checkbox',
                        typeData: { value: true },
                    },
                    isAttackHistoryEnabled: {
                        title: 'Enable Attack History',
                        subtitle: 'Enables a log of last attacks made during the event.',
                        type: 'checkbox',
                        typeData: { value: true },
                    },
                    maxAttackHistoryLength: {
                        title: 'Max Attack History Length',
                        subtitle: 'Maximum number of attack actions to keep in history.',
                        type: 'numeric',
                        typeData: { value: 10, min: 1, max: 100 },
                    },
                    isPlayerHistoryEnabled: {
                        title: 'Enable Player History',
                        subtitle: 'Enables a log of last players attacked during the event.',
                        type: 'checkbox',
                        typeData: { value: true },
                    },
                    maxPlayerHistoryLength: {
                        title: 'Max Player History Length',
                        subtitle: 'Maximum number of players attacked to keep in history.',
                        type: 'numeric',
                        typeData: { value: 10, min: 1, max: 100 },
                    },
                },
            },
        );
    }

    static titles = Object.freeze({
        CHOOSE_YOUR_DEFENSE: 'CHOOSE YOUR DEFENSE',
        CHOOSE_YOUR_ATTACK: 'CHOOSE YOUR ATTACK',
        HOW_THIS_WORKS: 'HOW THIS WORKS',
        LEAVE_OR_JOIN_GAME: 'LEAVE OR JOIN GAME',
    });

    static defaultStorageObject = () => ({
        total_attacks: { Strike: 0, Blast: 0, Inferno: 0 },
        total_hits: 0,
        total_misses: 0,
        total_token_gain: 0,
        avg_tokens_per_attack: 0.0,
        player_history: [],
        attack_history: [],
        timestamp: 0,
    });

    getTokenAmount = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.getTokenAmount.name,
            );
            return 0;
        }

        const $tokenAmount = $(page.container).find('a[href=\'item.php?id=1097\']').next().next().text();
        if (!$tokenAmount) {
            return 0;
        }

        const tokenAmountText = $tokenAmount.trim();
        const tokenAmount = parseInt(tokenAmountText.replace(/,/g, ''), 10);
        return isNaN(tokenAmount) ? 0 : tokenAmount;
    };

    makeStats = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.makeStats.name,
            );
            return;
        }

        if (!SettingsPlus.getValue('eventFeatures', 'bottleRocket', 'addStatsCards')) {
            ConsolePlus.log('Bottle Rocket stats cards are disabled in settings.');
            return;
        }

        const history = StoragePlus.get(
            'bottle_Rocket',
            BottleRocketPage.defaultStorageObject()
        );

        const $totalAttackTypeRows = Object.entries(history.total_attacks).map(
            ([color, count]) =>
                createRow({
                    title: ['<i class="fa fa-fw fa-rocket"></i>', ` Total ${color} Shots Made`],
                    rowId: `frpgp-total-attack-${color}-shot-history-row`,
                    afterLabel: count.toLocaleString(),
                })
        );

        const $totalAttacksRow = createRow({
            title: ['<i class="fa fa-fw fa-rocket"></i>', ' Total Attacks Made'],
            rowId: 'frpgp-total-attacks-history-row',
            afterLabel: Object.values(history.total_attacks).reduce((a, b) => a + b, 0).toLocaleString(),
        });

        const $totalHitsRow = createRow({
            title: ['<i class="fa fa-fw fa-bullseye"></i>', ' Total Hits'],
            rowId: 'frpgp-total-hits-history-row',
            afterLabel: history.total_hits.toLocaleString(),
        });

        const $totalMissesRow = createRow({
            title: ['<i class="fa fa-fw fa-times"></i>', ' Total Misses'],
            rowId: 'frpgp-total-misses-history-row',
            afterLabel: history.total_misses.toLocaleString(),
        });

        const $totalTokensRow = createRow({
            title: ['<i class="fa fa-fw fa-coins"></i>', ' Total Tokens Earned'],
            rowId: 'frpgp-total-tokens-history-row',
            afterLabel: history.total_token_gain.toLocaleString(),
        });

        const $avgTokensPerAttackRow = createRow({
            title: ['<i class="fa fa-fw fa-coins"></i>', ' Average Tokens Per Attack'],
            rowId: 'frpgp-avg-tokens-per-attack-history-row',
            afterLabel: history.avg_tokens_per_attack.toLocaleString(),
        });

        const $lastUpdatedRow = createRow({
            title: ['<i class="fa fa-fw fa-clock"></i>', ' Last Updated'],
            rowId: 'frpgp-last-updated-history-row',
            afterLabel: history.timestamp
                ? TimeControl.getLocaleTimeStringOnCT(history.timestamp)
                : 'Never',
        });

        const $statsCard = createCardList({
            cardId: 'frpgp-bottle-rocket-stats-card',
            title: 'Bottle Rocket Stats',
            children: [
                ...$totalAttackTypeRows,
                $totalAttacksRow,
                $totalHitsRow,
                $totalMissesRow,
                $totalTokensRow,
                $avgTokensPerAttackRow,
                $lastUpdatedRow,
            ]
        });

        const itExists = $(page.container).find('#frpgp-bottle-rocket-stats-card').length > 0;

        if (!itExists) {
            getListByTitle(
                page,
                BottleRocketPage.titles.LEAVE_OR_JOIN_GAME,
                { returnTitle: true }
            ).before(
                $statsCard
            );
        }
    };

    makeAttackHistory = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.makeAttackHistory.name,
            );
            return;
        }

        if (!SettingsPlus.getValue('eventFeatures', 'bottleRocket', 'isAttackHistoryEnabled')) {
            ConsolePlus.log('Bottle Rocket attack history is disabled in settings.');
            return;
        }

        const { attack_history: history } = StoragePlus.get(
            'bottle_Rocket',
            BottleRocketPage.defaultStorageObject()
        );

        let $noHistoryRow;
        if (history?.length === 0) {
            $noHistoryRow = createRow({
                title: ['<i class="fa fa-fw fa-times"></i>', ' No Attack History Found'],
                rowId: 'frpgp-no-attack-history-row',
            });
        }

        const $historyRows = $noHistoryRow
            ? [$noHistoryRow]
            : history.map((attack) => {
                const { attack_type: attackType, hits, misses } = attack;

                return createRow({
                    title: [
                        '<i class="fa fa-fw fa-rocket"></i>',
                        ` ${attackType} Shot`,
                    ],
                    rowId: `frpgp-attack-history-row-${hits}-${misses}-${attackType}`,
                    afterLabel: `Hits: ${hits} | Misses: ${misses} | Players Attacked: ${hits + misses}`,
                });
            });

        const $historyCard = createCardList({
            cardId: 'frpgp-bottle-rocket-attack-history-card',
            title: 'Attack History',
            children: $historyRows,
        });

        const itExists = $(page.container).find('#frpgp-bottle-rocket-attack-history-card').length > 0;
        if (!itExists) {
            getListByTitle(
                page,
                BottleRocketPage.titles.LEAVE_OR_JOIN_GAME,
                { returnTitle: true }
            ).before(
                $historyCard
            );
        }
    };

    makeLastPlayersHistory = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.makeLastPlayersHistory.name,
            );
            return;
        }

        if (!SettingsPlus.getValue('eventFeatures', 'bottleRocket', 'isPlayerHistoryEnabled')) {
            ConsolePlus.log('Bottle Rocket player history is disabled in settings.');
            return;
        }

        // profile.php?user_name=<player+name+with+spaces>

        const { player_history: history } = StoragePlus.get(
            'bottle_Rocket',
            BottleRocketPage.defaultStorageObject()
        );

        let $noHistoryRow;
        if (!history || history.length === 0) {
            $noHistoryRow = createRow({
                title: ['<i class="fa fa-fw fa-times"></i>', ' No Player History Found'],
                rowId: 'frpgp-no-player-history-row',
            });
        }

        const $historyRows = $noHistoryRow
            ? [$noHistoryRow]
            : history.map((player) => {
                const { player_name: playerName, hit_or_miss: hitOrMiss } = player;

                return createRow({
                    rowId: `frpgp-player-history-row-${parseNameForUrl(playerName)}`,
                    rowLink: `profile.php?user_name=${parseNameForUrl(playerName, { separator: '+', lowercase: false })}`,
                    title: [
                        '<i class="fa fa-fw fa-user"></i>',
                        ` ${playerName}`,
                    ],
                    afterLabel: `<strong style="color:${hitOrMiss === 'HIT' ? 'red' : ''}">${hitOrMiss}</strong>`,
                });
            });

        const $historyCard = createCardList({
            cardId: 'frpgp-bottle-rocket-player-history-card',
            title: 'Last Players Attacked (Oldest to Newest)',
            children: $historyRows,
        });

        const itExists = $(page.container).find('#frpgp-bottle-rocket-player-history-card').length > 0;
        if (!itExists) {
            getListByTitle(
                page,
                BottleRocketPage.titles.LEAVE_OR_JOIN_GAME,
                { returnTitle: true }
            ).before(
                $historyCard
            );
        }
    };

    startObserver = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.startObserver.name,
            );
            return;
        }

        const $attackButtons = $(page.container).find('.event-brb-attack');

        if ($attackButtons.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.startObserver.name,
            );
            return;
        }

        let stopMutatorHandle = null;
        $attackButtons.on('click', (event) => {

            stopMutatorHandle = watchForElement('.modal.modal-in', ($el) => {
                const $modalTitle = $el.find('.modal-title');
                if ($modalTitle.length === 0) {
                    stopMutatorHandle();
                    new FarmRPGPlusError(
                        ErrorTypesEnum.ELEMENT_NOT_FOUND,
                        this.startObserver.name,
                    );
                    return;
                }

                const modalTitle = $modalTitle.text().trim();

                if (modalTitle !== 'Attack Results') {
                    ConsolePlus.debug('Modal title is not "Attack Results":', modalTitle);
                    stopMutatorHandle();
                    new FarmRPGPlusError(
                        ErrorTypesEnum.ELEMENT_NOT_FOUND,
                        this.startObserver.name,
                    );
                    return;
                }

                const $modalText = $el.find('.modal-text');

                if ($modalText.length === 0) {
                    stopMutatorHandle();
                    new FarmRPGPlusError(
                        ErrorTypesEnum.ELEMENT_NOT_FOUND,
                        this.startObserver.name,
                    );
                    return;
                }

                const modalText = $el.text().trim();

                const earnedTokensMatch = modalText.match(/You earned (\d+) Event Tokens/);
                let earnedTokens = parseInt(earnedTokensMatch[1], 10);
                
                if (earnedTokensMatch && !isNaN(earnedTokens)) {
                    const currentTotalTokens = StoragePlus.get(
                        'bottle_Rocket.total_token_gain',
                        BottleRocketPage.defaultStorageObject().total_token_gain
                    );

                    StoragePlus.set(
                        'bottle_Rocket.total_token_gain',
                        currentTotalTokens + earnedTokens
                    );
                } else {
                    earnedTokens = 0; // Default to 0 if no match or invalid number
                }

                const attackResults = modalText.split('!').filter(line => line.includes('was'));
                if (attackResults.length === 0) {
                    stopMutatorHandle();
                    new FarmRPGPlusError(
                        ErrorTypesEnum.ELEMENT_NOT_FOUND,
                        this.startObserver.name,
                    );
                    return;
                }

                const attackResultObject = attackResults.reduce((acc, result) => {
                    const [playerName, hitOrMiss] = result.replace('Attack Results', '').split(' was ');
                    if (!playerName || !hitOrMiss) {
                        ConsolePlus.debug('Invalid attack result format:', result);
                        return acc;
                    }

                    // Update the history with the attack result
                    const currentPlayerHistory = StoragePlus.get(
                        'bottle_Rocket.player_history',
                        BottleRocketPage.defaultStorageObject().player_history
                    );

                    currentPlayerHistory.push({
                        player_name: playerName.trim(),
                        hit_or_miss: hitOrMiss.trim(),
                    });

                    const maxPlayerHistoryLength = SettingsPlus.getValue('eventFeatures', 'bottleRocket', 'maxPlayerHistoryLength', 10);
                    if (currentPlayerHistory.length > maxPlayerHistoryLength) {
                        currentPlayerHistory.splice(0, currentPlayerHistory.length - maxPlayerHistoryLength);
                    }

                    StoragePlus.set('bottle_Rocket.player_history', currentPlayerHistory);

                    acc.hits += hitOrMiss.includes('HIT') ? 1 : 0;
                    acc.misses += hitOrMiss.includes('MISSED') ? 1 : 0;

                    return acc;
                }, { hits: 0, misses: 0 });

                let attackType = $(event.target).attr('data-type');
                attackType = attackType === 'small'
                    ? 'Strike'
                    : attackType === 'medium'
                        ? 'Blast'
                        : attackType === 'large'
                            ? 'Inferno'
                            : 'Unknown';

                const totalAttacks = StoragePlus.get(
                    'bottle_Rocket.total_attacks',
                    BottleRocketPage.defaultStorageObject().total_attacks
                );

                if (attackType !== 'Unknown') {
                    totalAttacks[attackType] = (totalAttacks[attackType] || 0) + 1;
                } else if (DebugPlus.isDevelopmentMode()) {
                    totalAttacks['Unknown'] = (totalAttacks['Unknown'] || 0) + 1;
                }

                const currentAttackHistory = StoragePlus.get(
                    'bottle_Rocket.attack_history',
                    BottleRocketPage.defaultStorageObject().attack_history
                );

                const maxAttackHistoryLength = SettingsPlus.getValue('eventFeatures', 'bottleRocket', 'maxAttackHistoryLength', 10);
                if (currentAttackHistory.length > maxAttackHistoryLength) {
                    currentAttackHistory.splice(0, currentAttackHistory.length - maxAttackHistoryLength);
                }

                currentAttackHistory.push({
                    attack_type: attackType,
                    hits: attackResultObject.hits,
                    misses: attackResultObject.misses,
                });

                StoragePlus.set('bottle_Rocket.attack_history', currentAttackHistory);
                StoragePlus.set('bottle_Rocket.total_attacks', totalAttacks);
                
                StoragePlus.set(
                    'bottle_Rocket.total_hits',
                    StoragePlus.get('bottle_Rocket.total_hits', 0) + attackResultObject.hits
                );

                StoragePlus.set(
                    'bottle_Rocket.total_misses',
                    StoragePlus.get('bottle_Rocket.total_misses', 0) + attackResultObject.misses
                );

                let totalAttack = Object.values(totalAttacks).reduce((a, b) => a + b, 0);
                const avgTokenPerAttack = totalAttack > 0
                    ? StoragePlus.get('bottle_Rocket.total_token_gain', 0) / totalAttack
                    : 0.0;


                StoragePlus.set('bottle_Rocket.avg_tokens_per_attack', avgTokenPerAttack.toFixed(2));

                StoragePlus.set('bottle_Rocket.timestamp', Date.now());
            });
        });

        return stopMutatorHandle;
    };

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        if (!SettingsPlus.isEnabled('eventFeatures', 'bottleRocket')) {
            ConsolePlus.log('Bottle Rocket event features are disabled in settings.');
            return;
        }

        ConsolePlus.log('Bottle Rocket page initialized:', page);
        
        this.makeStats(page);
        this.makeAttackHistory(page);
        this.makeLastPlayersHistory(page);
        const callback = this.startObserver(page);

        return callback;
    };
}

export default BottleRocketPage;

// Attack Result Modal:
/**
 <div class="modal modal-in" style="display: block; margin-top: -131px;"><div class="modal-inner"><div class="modal-title">Attack Results</div><div class="modal-text">Detested was <strong>MISSED</strong>!<br>Itsyaboii was <strong><span style="color:red">HIT</span></strong>!<br>Sokko was <strong><span style="color:red">HIT</span></strong>!<br>beznadiyna was <strong><span style="color:red">HIT</span></strong>!<br>skinnyceps was <strong><span style="color:red">HIT</span></strong>!<br>Raindrop was <strong><span style="color:red">HIT</span></strong>!<br><br>You earned 5 Event Tokens!</div></div><div class="modal-buttons modal-buttons-1 "><span class="modal-button modal-button-bold">OK</span></div></div>
 */
