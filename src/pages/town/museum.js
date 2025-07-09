import ConsolePlus from "../../modules/consolePlus";
import StoragePlus from "../../modules/storagePlus";

class MuseumPage {
    static titles = Object.freeze({
        COLLECTION_PROGRESS: 'Collection Progress',
        CROPS: 'Crops',
        FISH: 'Fish',
        ITEMS: 'Items',
        SEEDS: 'Seeds',
        BAIT: 'Bait',
        MEALS: 'Meals',
        CARDS: 'Cards',
        EVENT: 'Event',
    });

    syncCollectionProgress = (page) => {
        if (!page?.container) {
            new FarmRPGPlusError(
                ErrorTypesEnum.PAGE_NOT_FOUND,
                this.syncCollectionProgress.name,
            );
            return;
        }
        
        const $itemBlocks = $(page.container).find(".col-25");
        
        if ($itemBlocks.length === 0) {
            ConsolePlus.log('No collection progress found on the Museum page.');
            return;
        }

        const cache = StoragePlus.get('items_collected_cache', {});

        $itemBlocks.each((_, element) => {
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

        ConsolePlus.log('Museum page initialized:', page);

        this.syncCollectionProgress(page);
    };

}

export default MuseumPage;