import GamePagesEnum from '../constants/gamePagesEnum';
import BottleRocketPage from './events/bottleRocket';
import HomePage from './home';
import ItemPage from './item';
import KitchenPage from './kitchen';
import NPCSPage from './npcs';
import OvenPage from './oven';
import QuestPage from './quest';
import QuestsPage from './quests';
import FarmSupplyPage from './town/supply';
import VaultPage from './town/vault';
import WellPage from './town/well';

const Pages = {
    [GamePagesEnum.HOME]: new HomePage,
    [GamePagesEnum.KITCHEN]: new KitchenPage,
    [GamePagesEnum.QUESTS]: new QuestsPage,
    [GamePagesEnum.NPCS]: new NPCSPage,

    [GamePagesEnum.OVEN]: new OvenPage,
    [GamePagesEnum.ITEM]: new ItemPage,
    [GamePagesEnum.QUEST]: new QuestPage,

    [GamePagesEnum.FARM_SUPPLY]: new FarmSupplyPage,
    [GamePagesEnum.VAULT]: new VaultPage,
    [GamePagesEnum.WELL]: new WellPage,

    [GamePagesEnum.BOTTLE_ROCKET]: new BottleRocketPage,
};

export default Pages;
