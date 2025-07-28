import { beforeEach, describe, expect, it, vi } from 'vitest';
import VaultPage from '../src/pages/town/vault';

// Mock dependencies
vi.mock('../../../modules/consolePlus', () => ({
    debug: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
}));

describe('VaultPage', () => {
    let vaultPage;

    beforeEach(() => {

        vaultPage = new VaultPage(false);
    });

    describe('guessVaultCode', () => {
        // Helper function to generate hints for a guess against the actual code
        function generateHintList(actualCode, guess, hintList = []) {
            const hints = [];
            const actualDigits = actualCode.split('');
            const guessDigits = guess.split('');
            
            // Track which actual digits have been matched already
            const matchedActualIndices = new Set;
            
            // Single pass to determine all hint types
            for (let i = 0; i < 4; i++) {
                if (guessDigits[i] === actualDigits[i]) {
                // Right digit, right position (blue)
                    hints.push({ color: 'blue', number: guessDigits[i] });
                    matchedActualIndices.add(i);
                } else {
                // Check if digit exists elsewhere in the actual code
                    const indexInActual = actualDigits.findIndex((digit, index) =>
                        digit === guessDigits[i] && !matchedActualIndices.has(index));
                
                    if (indexInActual !== -1) {
                        // Right digit, wrong position (yellow)
                        hints.push({ color: 'yellow', number: guessDigits[i] });
                        matchedActualIndices.add(indexInActual);
                    } else {
                        // Digit not in the code (gray)
                        hints.push({ color: 'gray', number: guessDigits[i] });
                    }
                }
            }
            
            return hintList.concat(hints);
        }

        function isVaultUnlocked(hintsList = []) {
            const hi = hintsList.length;
            if (hi === 0) {
                return false;
            }

            const lastHints = hintsList.slice(-4);
            return lastHints.every(hint => hint.color === 'blue');
        }

        it('should be able to generate hints for a guess', () => {
            const actualCode = '1234';
            let hints = generateHintList(actualCode, '1243');
            expect(hints).toEqual([
                { color: 'blue', number: '1' },
                { color: 'blue', number: '2' },
                { color: 'yellow', number: '4' },
                { color: 'yellow', number: '3' },
            ]);

            hints = generateHintList(actualCode, '5678', hints);

            expect(hints).toEqual([
                { color: 'blue', number: '1' },
                { color: 'blue', number: '2' },
                { color: 'yellow', number: '4' },
                { color: 'yellow', number: '3' },
                { color: 'gray', number: '5' },
                { color: 'gray', number: '6' },
                { color: 'gray', number: '7' },
                { color: 'gray', number: '8' },
            ]);

            hints = generateHintList(actualCode, '1232', hints);
            expect(hints).toEqual([
                { color: 'blue', number: '1' },
                { color: 'blue', number: '2' },
                { color: 'yellow', number: '4' },
                { color: 'yellow', number: '3' },
                { color: 'gray', number: '5' },
                { color: 'gray', number: '6' },
                { color: 'gray', number: '7' },
                { color: 'gray', number: '8' },
                { color: 'blue', number: '1' },
                { color: 'blue', number: '2' },
                { color: 'blue', number: '3' },
                { color: 'gray', number: '2' },
            ]);
        });

        it('should be able to guess every code possible', () => {
            const TOTAL_CODES = 10000; // 0001 to 9999
            const MAX_ATTEMPTS = 10;
            const SAMPLE_SIZE = TOTAL_CODES;

            let crackedCodes = 0;
            let totalAttempts = 0;

            let maxAttemptsNeeded = 0;
            let maxAttemptHintList = [];
            let minAttemptsNeeded = Infinity;
            let minAttemptHintList = [];

            let failedCodes = [];

            // Function to test a single code
            function testCode(actualCode) {
                let hintList = [];
                let attempts = 0;

                while (attempts < MAX_ATTEMPTS) {
                    const guess = vaultPage.guessVaultCode(hintList);
                    hintList = generateHintList(actualCode, guess, hintList);
                    attempts++;

                    if (isVaultUnlocked(hintList)) {
                        crackedCodes++;
                        totalAttempts += attempts;

                        if (attempts > maxAttemptsNeeded) {
                            maxAttemptsNeeded = Math.max(maxAttemptsNeeded, attempts);
                            maxAttemptHintList = [...hintList];
                        }
                        if (attempts < minAttemptsNeeded && guess !== '0123') {
                            minAttemptsNeeded = Math.min(minAttemptsNeeded, attempts);
                            minAttemptHintList = [...hintList];
                        }
                        return true; // Code cracked
                    }
                }

                failedCodes.push(actualCode);
                return false;
            }

            const codesToTest = [];
            if (SAMPLE_SIZE < TOTAL_CODES) {
                const sampleSet = new Set;
                while (sampleSet.size < SAMPLE_SIZE) {
                    const randomCode = String(Math.floor(Math.random() * TOTAL_CODES)).padStart(4, '0');
                    
                    if (sampleSet.has(randomCode)) {
                        continue; // Skip if already added
                    }

                    if (randomCode === '0000') {
                        continue; // Skip the '0000' code
                    }
                    sampleSet.add(randomCode);
                }
                codesToTest.push(...sampleSet);
            } else {
                for (let i = 1; i < TOTAL_CODES; i++) {
                    codesToTest.push(String(i).padStart(4, '0'));
                }
            }
            
            codesToTest.forEach((code, _index) => testCode(code));

            console.log(
                'Results:\n' +
                `- Tested: ${codesToTest.length} codes\n` +
                `- Solved: ${crackedCodes} codes (${(crackedCodes / codesToTest.length * 100).toFixed(2)}%)\n` +
                `- Failed: ${failedCodes.length} codes\n` +
                `- Total attempts: ${totalAttempts}\n` +
                `- Average attempts: ${(totalAttempts / crackedCodes).toFixed(2)}\n` +
                `- Min attempts needed other than 1 for default first guess: ${minAttemptsNeeded}\n` +
                `- Min attempt guesses: ${minAttemptHintList.reduce((acc, hint, index) => {
                    acc += hint.number;
                    if (index % 4 === 3 && index !== minAttemptHintList.length - 1) {
                        acc += ' > ';
                    }
                    return acc;
                }, '\nStart > ')}\n` +
                `- Max attempts needed: ${maxAttemptsNeeded}\n` +
                `- Max attempt guesses: ${maxAttemptHintList.reduce((acc, hint, index) => {
                    acc += hint.number;
                    if (index % 4 === 3 && index !== maxAttemptHintList.length - 1) {
                        acc += ' > ';
                    }
                    return acc;
                }, '\nStart > ')}`
            );

            if (failedCodes.length > 0) {
                console.log(`Failed codes: ${failedCodes.slice(0, 10).join(', ')}${failedCodes.length > 10 ? '...' : ''}`);
            }

            expect(failedCodes.length).toBe(0, `Failed to crack ${failedCodes.length} codes`);
        }, 35 * 1000);
    });
});
