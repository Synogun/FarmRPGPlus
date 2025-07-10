import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import { createRow } from '../../modules/rowFactory';
import StoragePlus from '../../modules/storagePlus';
import SettingsPlus from '../../modules/settingsPlus';

StoragePlus;
createRow;

class SettingsOptionsPage {

    addUserscriptConfiguration = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.addUserscriptConfiguration.name,
            );
            return;
        }

        const $saveGameOptionsButton = $(page.container).find('.content-block').last();
        if ($saveGameOptionsButton.length === 0) {
            new FarmRPGPlusError(
                ErrorTypesEnum.ELEMENT_NOT_FOUND,
                this.addUserscriptConfiguration.name,
            );
            return;
        }

        const settings = SettingsPlus.getAllFeatures();
        if (!settings || Object.keys(settings).length === 0) {
            ConsolePlus.log('No settings available to display.');
            return;
        }

        const $listContent = [];

        for (const page of settings) {
            const $pageTitle = $("<li>")
                .addClass('list-group-title')
                .addClass('item-divider')
                .text(page.title);

            $listContent.push($pageTitle);

            for (const config of pageDef.configs) {
                
            }
        
        }
            

        const $listBlock = $("<div>")
            .addClass('list-block')
            .append(
                $("<ul>").append($listContent)
            );
        
        const $contentBlock = $("<div>")
            .attr('id', 'frpgp-userscript-configuration')
            .addClass('content-block')
            .append(
                "<div class='content-block-title' id='frpgp-userscript-configuration-title'>FRPGP Configuration</div>",
                $listBlock,
            );
        
        const frpgpConfigs = $(page.container).find('#frpgp-userscript-configuration').length > 0;
        if (!frpgpConfigs) {
            $saveGameOptionsButton.after($contentBlock);
        }
    };
    
    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Settings Options page initialized:', page);
        this.addUserscriptConfiguration(page);
    };

}

export default SettingsOptionsPage;
