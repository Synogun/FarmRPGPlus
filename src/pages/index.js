import GamePagesEnum from '../constants/gamePagesEnum';
import BottleRocketPage from './events/bottleRocket';
import FishingPage from './home/fishing';
import HomePage from './home/home';
import InventoryPage from './home/inventory';
import ItemPage from './home/item';
import NPCSPage from './home/npcs';
import QuestPage from './home/quest';
import QuestsPage from './home/quests';
import WorkshopPage from './home/workshop';
import KitchenPage from './kitchen/kitchen';
import OvenPage from './kitchen/oven';
import SettingsColorsPage from './settings/settingsColors';
import SettingsEmblemsPage from './settings/settingsEmblems';
import SettingsOptionsPage from './settings/settingsOptions';
import CommunityCenterPage from './town/communityCenter';
import MuseumPage from './town/museum';
import FarmSupplyPage from './town/supply';
import VaultPage from './town/vault';
import WellPage from './town/well';

const Pages = {
    [GamePagesEnum.HOME]: new HomePage,
    [GamePagesEnum.INVENTORY]: new InventoryPage,
    [GamePagesEnum.WORKSHOP]: new WorkshopPage,
    [GamePagesEnum.KITCHEN]: new KitchenPage,
    [GamePagesEnum.FISHING]: new FishingPage,
    [GamePagesEnum.HELP_NEEDED]: new QuestsPage,
    [GamePagesEnum.NPCS]: new NPCSPage,

    [GamePagesEnum.OVEN]: new OvenPage,
    [GamePagesEnum.ITEM]: new ItemPage,
    [GamePagesEnum.QUEST]: new QuestPage,

    [GamePagesEnum.FARM_SUPPLY]: new FarmSupplyPage,
    [GamePagesEnum.VAULT]: new VaultPage,
    [GamePagesEnum.WISHING_WELL]: new WellPage,
    [GamePagesEnum.COMMUNITY_CENTER]: new CommunityCenterPage,
    [GamePagesEnum.MUSEUM]: new MuseumPage,

    [GamePagesEnum.SETTINGS_OPTIONS]: new SettingsOptionsPage,
    [GamePagesEnum.SETTINGS_EMBLEMS]: new SettingsEmblemsPage,
    [GamePagesEnum.SETTINGS_COLORS]: new SettingsColorsPage,

    // Events
    [GamePagesEnum.BOTTLE_ROCKET]: new BottleRocketPage,
};

export default Pages;
