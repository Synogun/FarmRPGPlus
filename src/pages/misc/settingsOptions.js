import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError, throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import SettingsPlus from '../../modules/settingsPlus';
import StoragePlus from '../../modules/storagePlus';

StoragePlus;
createRow;

class SettingsOptionsPage {

    createCheckboxRow = (page, featureObject, isConfig) => {
        if (!featureObject || !featureObject.title || !featureObject.subtitle) {
            ConsolePlus.warn('Invalid feature configuration:', featureObject);
            return null;
        }

        const $itemContent = $('<div>').addClass('item-content');

        const $itemInner = $('<div>')
            .addClass('item-inner')
            .attr({
                'role': 'checkbox',
                'id': `${featureObject.id}-aria`,
                'aria-labelledby': `${featureObject.id}-label`,
                'aria-checked': featureObject.typeData.value === true ? 'true' : 'false',
            });

        const $itemTitle = $('<div>')
            .addClass('item-title label')
            .css('width', '60%')
            .append(
                $('<label>')
                    .attr('id', `${featureObject.id}-label`)
                    .attr('for', `${featureObject.id}-input`)
                    .append(featureObject.title),
                '<br>',
                $('<span>')
                    .css('font-size', '11px')
                    .append(featureObject.subtitle)
            );

        const $labelSwitch = $('<label>')
            .addClass('label-switch')
            .append(
                $('<input>')
                    .addClass('frpgp-options')
                    .attr({
                        type: 'checkbox',
                        id: `${featureObject.id}-input`,
                        name: `${featureObject.id}-name`,
                        value: '1',
                    })
                    .prop('checked', featureObject.typeData.value)
                    .on('change', function () {
                        const isChecked = $itemInner.attr('aria-checked') === 'true';

                        SettingsPlus.setValue(
                            page.pageId,
                            isConfig ? featureObject.featureId : featureObject.id,
                            isConfig ? featureObject.id : undefined,
                            !isChecked
                        );

                        $itemInner.attr(
                            'aria-checked',
                            isChecked ? 'false' : 'true'
                        );
                    }),
                $('<div>').addClass('checkbox')
            );

        $itemInner.append([$itemTitle, $labelSwitch]);
        $itemContent.append($itemInner);
        return $itemContent;
    };

    createNumericRow = (page, featureObject, isConfig) => {
        if (!featureObject || !featureObject.title || !featureObject.subtitle) {
            ConsolePlus.warn('Invalid feature configuration:', featureObject);
            return null;
        }

        const $itemContent = $('<div>').addClass('item-content');
        const $itemInner = $('<div>').addClass('item-inner');

        const $itemTitle = $('<div>')
            .addClass('item-title label')
            .append(
                featureObject.title,
                '<br>',
                $('<span>')
                    .css('font-size', '11px')
                    .append(featureObject.subtitle)
            );

        const $itemAfter = $('<div>')
            .addClass('item-after')
            .append(
                $('<input>')
                    .attr({
                        type: 'text',
                        name: `${featureObject.id}-input`,
                        value: featureObject.typeData.value,
                    })
                    .addClass('inlineinputsm')
                    .css('width', '60px')
                    .on('change', function () {
                        if (!featureObject.typeData.min || !featureObject.typeData.max) {
                            ConsolePlus.warn(`Numeric feature ${featureObject.id} does not have min/max defined.`);
                            return;
                        }

                        let oldValue = SettingsPlus.getValue(
                            page.pageId,
                            isConfig ? featureObject.featureId : featureObject.id,
                            isConfig ? featureObject.id : undefined
                        );
                        let value = parseInt($(this).val(), 10);
                        if (isNaN(value)) {
                            value = oldValue;
                        }
                        
                        if (value < (featureObject?.typeData?.min ?? 1)) {
                            $(this).val(featureObject.typeData.min);
                        }

                        if (value > (featureObject?.typeData?.max ?? 100)) {
                            $(this).val(featureObject.typeData.max);
                        }

                        SettingsPlus.setValue(
                            page.pageId,
                            isConfig ? featureObject.featureId : featureObject.id,
                            isConfig ? featureObject.id : undefined,
                            value
                        );
                    })
            );

        $itemInner.append([$itemTitle, $itemAfter]);
        $itemContent.append($itemInner);
        return $itemContent;
    };

    createSelectRow = (page, featureObject, isConfig) => {
        if (!featureObject || !featureObject.title || !featureObject.subtitle) {
            ConsolePlus.warn('Invalid feature configuration:', featureObject);
            return null;
        }

        if (isConfig && !featureObject.typeData?.options) {
            ConsolePlus.warn('Invalid feature configuration for select row:', featureObject);
            return null;
        }

        const $itemContent = $('<div>').addClass('item-content');
        const $itemInner = $('<div>').addClass('item-inner');

        const $itemTitle = $('<div>')
            .addClass('item-title')
            .append(
                featureObject.title,
                '<br>',
                $('<span>')
                    .css('font-size', '11px')
                    .append(featureObject.subtitle)
            );

        const selectOptions = [];

        if (!featureObject.typeData.options || !Array.isArray(featureObject.typeData.options)) {
            ConsolePlus.warn('Invalid feature options:', featureObject.typeData.options);
        }
        
        for (const option of featureObject.typeData.options) {
            if (!option || !option.value || !option.label) {
                ConsolePlus.warn('Invalid feature option:', option);
                continue;
            }
            
            const selectOption = $('<option>')
                .attr('value', option.value)
                .text(option.label);
                
            if (option.value === featureObject.typeData.value) {
                selectOption.attr('selected', '');
            }

            selectOptions.push(selectOption);
        }

        const $itemAfter = $('<div>')
            .addClass('item-after')
            .append(
                $('<select>')
                    .attr('name', `${featureObject.id}-input`)
                    .addClass('inlineinputlg')
                    .on('change', function () {
                        const value = $(this).val();
                        SettingsPlus.setValue(
                            page.pageId,
                            isConfig ? featureObject.featureId : featureObject.id,
                            isConfig ? featureObject.id : undefined,
                            value
                        );
                    })
                    .append(selectOptions)
            );

        $itemInner.append([$itemTitle, $itemAfter]);
        $itemContent.append($itemInner);
        return $itemContent;
    };

    makeConfigFeatureRow = (page, feature, isConfig = false) => {
        if (!feature || !feature.title || !feature.subtitle) {
            ConsolePlus.warn('Invalid feature configuration:', feature);
            return null;
        }

        if (isConfig && !feature.configId && !feature.featureId) {
            ConsolePlus.warn('Invalid feature configuration for many config row:', feature);
            return null;
        }

        const featureObject = {};

        if (isConfig) {
            featureObject.id = feature.configId;
            featureObject.featureId = feature.featureId;
            featureObject.title = feature.title;
            featureObject.subtitle = feature.subtitle;
            featureObject.type = feature.type ?? 'checkbox';
            featureObject.typeData = {
                ...feature.typeData,
                value: feature.typeData?.value ?? false
            };
        } else {
            featureObject.id = feature.featureId;
            featureObject.title = feature.enableTitle ?? feature.title;
            featureObject.subtitle = feature.enableSubtitle ?? feature.subtitle;
            featureObject.type = 'checkbox';
            featureObject.typeData = { value: feature.isEnabled ?? false };
        }

        let $itemContent;
        
        switch (featureObject.type) {
            case 'checkbox':
                $itemContent = this.createCheckboxRow(page, featureObject, isConfig);
                break;

            case 'numeric':
                $itemContent = this.createNumericRow(page, featureObject, isConfig);
                break;

            case 'select':
                $itemContent = this.createSelectRow(page, featureObject, isConfig);
                break;

            default:
                ConsolePlus.warn('Unsupported feature type:', featureObject.type);
                return null;
        }
        const $li = $('<li>')
            .attr('id', `${featureObject.id}-row`)
            .append($itemContent);

        return $li;
    };

    makeManyConfigFeatureRow = (page, feature) => {
        if (!feature || !feature.title || !feature.subtitle || !feature.configs) {
            ConsolePlus.warn('Invalid feature configuration:', feature);
            return null;
        }
    
        const $accordionHeader = $('<a>')
            .attr('href', '#')
            .addClass('item-content item-link')
            .append(
                $('<div>').addClass('item-inner').append(
                    $('<div>').addClass('item-title').append(
                        feature.title,
                        $('<br>'),
                        $('<span>')
                            .css('font-size', '11px')
                            .append(feature.subtitle)
                    ),
                )
            );

        const $accordionContent = $('<div>')
            .addClass('accordion-item-content');

        const $listBlock = $('<div>')
            .addClass('list-block');

        const $ul = $('<ul>');

        let $li = this.makeConfigFeatureRow(page, feature, false);
        $ul.append($li);

        for (const config of feature.configs) {
            if (!config || !config.title || !config.subtitle) {
                ConsolePlus.warn('Invalid config:', config);
                continue;
            }

            if (config.old) {
                continue;
            }

            const featureFinal = {
                ...config,
                featureId: feature.featureId
            };
            $li = this.makeConfigFeatureRow(page, featureFinal, true);
            if ($li) {
                $ul.append($li);
            }
        }

        $listBlock.append($ul);
        $accordionContent.append($listBlock);
        
        const $accordionItem = $('<li>')
            .addClass('accordion-item')
            .append($accordionHeader, $accordionContent);

        return $accordionItem;
    };

    addUserscriptConfiguration = (page) => {
        throwIfPageInvalid(page, this.addUserscriptConfiguration.name);

        const $saveGameOptionsButton = $(page.container).find('.content-block').last();
        if ($saveGameOptionsButton.length === 0) {
            throw new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addUserscriptConfiguration.name,
                'Save Options button not found in the page container.'
            );
        }

        const settings = SettingsPlus.getAllFeatures();
        if (!settings || Object.keys(settings).length === 0) {
            ConsolePlus.log('No settings available to display.');
            return;
        }

        const $listContent = [];

        for (const page of settings) {
            const $pageTitle = $('<li>')
                .addClass('list-group-title item-divider')
                .text(`${page.title} Options`);

            $listContent.push($pageTitle);

            for (const feature of page.features) {
                const $li = feature.configs.filter(config => !config.old).length > 0
                    ? this.makeManyConfigFeatureRow(page, feature)
                    : this.makeConfigFeatureRow(page, feature);

                $listContent.push($li);
            }
        }

        const $listBlock = $('<div>')
            .addClass('list-block')
            .append(
                $('<ul>').append($listContent)
            );

        const $contentTitle = $('<div>')
            .addClass('content-block-title')
            .attr('id', 'frpgp-userscript-configuration-title')
            .append(
                $('<span>')
                    .css({ 'font-size': '11px', 'float': 'right' })
                    .append(
                        'Settings are saved automatically when changed'
                    ),
                'FarmRPG Plus Configuration'
            );

        const $contentBlock = $('<div>')
            .attr('id', 'frpgp-userscript-configuration')
            .addClass('content-block')
            .append(
                $contentTitle,
                $listBlock,
            );
        
        const frpgpConfigs = $(page.container).find('#frpgp-userscript-configuration').length > 0;
        if (!frpgpConfigs) {
            $saveGameOptionsButton.after(
                '<p>&nbsp;</p>',
                $contentBlock
            );
        }
    };

    addResetEverythingButton = (page) => {
        throwIfPageInvalid(page, this.addResetEverythingButton.name);
    
        const $saveGameOptionsButton = $(page.container).find('.content-block').last();
        const $configListBlock = $(page.container).find('#frpgp-userscript-configuration');

        const $resetEverythingButton = $('<a>')
            .attr('id', 'frpgp-reset-everything-button')
            .addClass('button btn btnred')
            .text('Reset all settings to default')
            .on('click', (evt) => {
                evt.preventDefault();
                myApp.confirm(
                    'Are you sure you want to reset all FarmRPG Plus settings?\n\n' +
                    'This action cannot be undone.',
                    'Reset FarmRPG Plus settings',
                    () => {
                        ConsolePlus.log('Resetting all settings to default.');
                        StoragePlus.clear();
                        myApp.alert(
                            'All FarmRPG Plus settings have been reset to default.',
                            'Success',
                            () => { window.location.reload(); }
                        );
                    },
                    () => {},
                );
            });

        if (!$configListBlock.length) {
            $saveGameOptionsButton.after(
                '<p>&nbsp;</p>',
                $('<div>')
                    .addClass('content-block')
                    .append(
                        $resetEverythingButton
                    )
            );
        } else {
            $configListBlock.after(
                $('<div>')
                    .addClass('content-block')
                    .append($resetEverythingButton)
            );
        }
    };
    
    applyHandler = (page) => {
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Settings Options page initialized:', page);
        this.addUserscriptConfiguration(page);
        this.addResetEverythingButton(page);
    };

}

export default SettingsOptionsPage;

/* Example config with additional options
<li class="accordion-item">
    <a href="#" class="item-content item-link">
        <div class="item-inner">
            <div class="item-title">
                config title goes here
                <br>
                <span style="font-size: 11px">config subtitle goes here</span>
            </div>
        </div>
    </a>
    <div class="accordion-item-content" style="">
        <div style="" class="list-block">
            <ul>
                <li>
                    <div class="item-content">
                        <div class="item-inner" role="checkbox" id="subconfigId-aria" aria-labelledby="subconfigId-label" aria-checked="false">
                            <div class="item-title label" style="width:60%">
                                <label id="subconfigId-label" for="subconfigId-input">subconfig title goes here</label>
                                <br>
                                <span style="font-size: 11px">subconfig subtitle goes here</span>
                            </div>
                            <label class="label-switch">
                                <input type="checkbox" class="frpgp-options" id="subconfigId-input" name="subconfigId-name" value="1">
                                <div class="checkbox"></div>
                            </label>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">
                                Launcher Amount
                                <br>
                                <span style="font-size: 11px">
                                    Number of Large Nets to launch per use
                                    <br>
                                    Set between 10 and 50 and watch your Inventory Cap
                                </span>
                            </div>
                            <div class="item-after">
                                <input type="text" name="lnl_amt" value="50" class="inlineinputsm" style="width:60px">
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title">
                                Background Music
                                <br>
                                <span style="font-size: 11px">
                                    iOS (all players)
                                    <br>
                                    Android (IN BETA)
                                </span>
                            </div>
                            <div class="item-after">
                                <select name="music" class="inlineinputlg">
                                    <option value="none" checked="">None</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3 (Winter)</option>
                                </select>
                            </div>
                        </div>
                    </div>
               </li>
            </ul>
        </div>
    </div>
</li>
*/
