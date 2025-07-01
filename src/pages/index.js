import HomePage from './home';
import ItemPage from './item';
import NPCSPage from './npcs';
import QuestPage from './quest';
import QuestsPage from './quests';
import WellPage from './town/well';

const Pages = {
    home: new HomePage,
    quests: new QuestsPage,
    npcs: new NPCSPage,
    
    item: new ItemPage,
    quest: new QuestPage,

    well: new WellPage,
};

export default Pages;
