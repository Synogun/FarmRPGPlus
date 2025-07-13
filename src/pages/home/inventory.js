import $ from 'jquery';
import { ErrorTypesEnum, FarmRPGPlusError } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import StoragePlus from '../../modules/storagePlus';

class InventoryPage {

    syncCollectionProgress = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.syncCollectionProgress.name,
            );
            return;
        }

        const $itemNames = $(page.container).find('.item-title strong');

        if ($itemNames.length === 0) {
            ConsolePlus.log('No collection progress found on the Museum page.');
            return;
        }

        const cache = StoragePlus.get('items_collected_cache', {});

        $itemNames.each((_, element) => {
            const itemName = $(element).text().trim();

            if (!itemName || itemName === '-') {
                return;
            }

            cache[itemName] = cache[itemName] || true;
        });

        StoragePlus.set('items_collected_cache', cache);
        ConsolePlus.log('Collection progress cache updated');
    };
    

    applyHandler = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.applyHandler.name,
            );
            return;
        }

        ConsolePlus.log('Inventory page initialized:', page);

        this.syncCollectionProgress(page);
    };
}

export default InventoryPage;
