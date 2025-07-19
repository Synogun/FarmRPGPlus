import $ from 'jquery';
import { throwIfPageInvalid } from '../../FarmRPGPlusError';
import ConsolePlus from '../../modules/consolePlus';
import StoragePlus from '../../modules/storagePlus';

class InventoryPage {

    syncCollectionProgress = (page) => {
        throwIfPageInvalid(page, this.syncCollectionProgress.name);

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
        throwIfPageInvalid(page, this.applyHandler.name);

        ConsolePlus.log('Inventory page initialized:', page);

        this.syncCollectionProgress(page);
    };
}

export default InventoryPage;
