import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                $$: 'readonly',
                mainView: 'readonly',
                myApp: 'readonly',
                Dom7: 'readonly',
                process: 'readonly',
                MutationObserver: 'readonly',
            },
        },
    },
    {
        plugins: { js },
        extends: ['js/recommended'],
        rules: {
            // https://eslint.org/docs/latest/rules/no-duplicate-imports
            'no-duplicate-imports': ['error', { includeExports: true }],
            // https://eslint.org/docs/latest/rules/no-template-curly-in-string
            'no-template-curly-in-string': 'error',
            // https://eslint.org/docs/latest/rules/no-unused-vars
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
            // https://eslint.org/docs/latest/rules/no-use-before-define
            'no-use-before-define': ['error', { functions: false }],
            // https://eslint.org/docs/latest/rules/default-case
            'default-case': 'error',
            // https://eslint.org/docs/latest/rules/default-case-last
            'default-case-last': 'error',
            // https://eslint.org/docs/latest/rules/eqeqeq
            'eqeqeq': 'error',
            // https://eslint.org/docs/latest/rules/grouped-accessor-pairs
            'grouped-accessor-pairs': ['error', 'getBeforeSet'],
            // https://eslint.org/docs/latest/rules/strict
            'strict': ['error', 'global']
        },
    },
    {
        plugins: { stylistic },
        rules: {
            // https://eslint.style/rules/array-bracket-newline
            'stylistic/array-bracket-newline': ['error', 'consistent'],
            // https://eslint.style/rules/array-bracket-spacing
            'stylistic/array-bracket-spacing': ['error', 'never'],
            // https://eslint.style/rules/array-element-newline
            'stylistic/array-element-newline': ['error', 'consistent'],
            // https://eslint.style/rules/arrow-parens
            'stylistic/arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
            // https://eslint.style/rules/arrow-spacing
            'stylistic/arrow-spacing': 'error',
            // https://eslint.style/rules/block-spacing
            'stylistic/block-spacing': 'error',
            // https://eslint.style/rules/brace-style
            'stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            // https://eslint.style/rules/comma-dangle
            'stylistic/comma-dangle': ['error', 'only-multiline'],
            // https://eslint.style/rules/comma-spacing
            'stylistic/comma-spacing': ['error', { before: false, after: true }],
            // https://eslint.style/rules/comma-style
            'stylistic/comma-style': ['error', 'last'],
            // https://eslint.style/rules/curly-newline
            'stylistic/curly-newline': ['error', { consistent: true }],
            // https://eslint.style/rules/dot-location
            'stylistic/dot-location': ['error', 'property'],
            // https://eslint.style/rules/eol-last
            'stylistic/eol-last': ['error', 'always'],
            // https://eslint.style/rules/function-call-spacing
            'stylistic/function-call-spacing': ['error', 'never'],
            // https://eslint.style/rules/function-call-argument-newline
            'stylistic/function-call-argument-newline': ['error', 'consistent'],
            // https://eslint.style/rules/function-paren-newline
            'stylistic/function-paren-newline': ['error', 'consistent'],
            // https://eslint.style/rules/indent
            'stylistic/indent': ['error', 4],
            // https://eslint.style/rules/indent-binary-ops
            'stylistic/indent-binary-ops': ['error', 4],
            // https://eslint.style/rules/keyword-spacing
            'stylistic/keyword-spacing': ['error'],
            // https://eslint.style/rules/member-delimiter-style
            'stylistic/member-delimiter-style': 'error',
            // https://eslint.style/rules/multiline-ternary
            'stylistic/multiline-ternary': ['error', 'always-multiline'],
            // https://eslint.style/rules/new-parens
            'stylistic/new-parens': ['error', 'never'],
            // https://eslint.style/rules/no-extra-parens
            'stylistic/no-extra-parens': ['error', 'all', { nestedBinaryExpressions: false }],
            // https://eslint.style/rules/no-extra-semi
            'stylistic/no-extra-semi': 'error',
            // https://eslint.style/rules/no-floating-decimal
            'stylistic/no-floating-decimal': 'error',
            // https://eslint.style/rules/no-mixed-operators
            'stylistic/no-mixed-operators': 'error',
            // https://eslint.style/rules/no-mixed-spaces-and-tabs
            'stylistic/no-mixed-spaces-and-tabs': 'error',
            // https://eslint.style/rules/no-multi-spaces
            'stylistic/no-multi-spaces': 'error',
            // https://eslint.style/rules/no-trailing-spaces
            'stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],
            // https://eslint.style/rules/no-whitespace-before-property
            'stylistic/no-whitespace-before-property': 'error',
            // https://eslint.style/rules/object-curly-newline
            'stylistic/object-curly-newline': ['error', { consistent: true }],
            // https://eslint.style/rules/object-curly-spacing
            'stylistic/object-curly-spacing': ['error', 'always'],
            // https://eslint.style/rules/operator-linebreak
            'stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
            // https://eslint.style/rules/quote-props
            'stylistic/quote-props': ['error', 'consistent-as-needed'],
            // https://eslint.style/rules/quotes
            'stylistic/quotes': ['error', 'single'],
            // https://eslint.style/rules/rest-spread-spacing
            'stylistic/rest-spread-spacing': ['error', 'never'],
            // https://eslint.style/rules/semi
            'stylistic/semi': 'error',
            // https://eslint.style/rules/semi-spacing
            'stylistic/semi-spacing': 'error',
            // https://eslint.style/rules/semi-style
            'stylistic/semi-style': ['error', 'last'],
            // https://eslint.style/rules/space-before-blocks
            'stylistic/space-before-blocks': 'error',
            // https://eslint.style/rules/space-before-function-paren
            'stylistic/space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
            // https://eslint.style/rules/space-in-parens
            'stylistic/space-in-parens': ['error', 'never'],
            // https://eslint.style/rules/space-unary-ops
            'stylistic/space-unary-ops': 'error',
            // https://eslint.style/rules/switch-colon-spacing
            'stylistic/switch-colon-spacing': 'error',
            // https://eslint.style/rules/template-curly-spacing
            'stylistic/template-curly-spacing': ['error', 'never'],
            // https://eslint.style/rules/type-annotation-spacing
            'stylistic/type-annotation-spacing': ['error', { before: false, after: true }],
            // https://eslint.style/rules/type-generic-spacing
            'stylistic/type-generic-spacing': ['error'],
            // https://eslint.style/rules/type-named-tuple-spacing
            'stylistic/type-named-tuple-spacing': ['error'],
        },
    },
    {
        ignores: ['dist', 'node_modules', 'webpack.config.cjs'],
    },
]);
