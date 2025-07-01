const NavBarLinks = Object.freeze({
    INDEX: 'index-1',
    PROFILE: 'profile',
    INVENTORY: 'inventory',
    WORKSHOP: 'workshop',
    KITCHEN: 'kitchen',
    POST_OFFICE: 'postoffice',
    MESSAGES: 'messages',
    FRIENDS: 'friends',
    SETTINGS: 'settings',
    TOWN: 'town',
    LIBRARY: 'wiki',
    ABOUT: 'about',
});

const HomePageLinks = Object.freeze({
    MY_FARM: 'xfarm',
    INVENTORY: 'inventory',
    WORKSHOP: 'workshop',
    KITCHEN: 'kitchen',
    TOWN: 'town',
    FISHING: 'fish',
    EXPLORE: 'explore',
    QUESTS: 'quests',
    TOWER: 'tower',

    PERKS: 'perks',
    MASTERY: 'mastery',
    NPCS: 'npclevels',
    DAILY_CHORES: 'daily',
});

const TownPageLinks = Object.freeze({
    TOWN: 'town',
    COUNTRY_STORE: 'store',
    FARMERS_MARKET: 'market',
    FLEA_MARKET: 'flea',
    FARM_SUPPLY: 'supply',
    BORGEN_MERCANTILE: 'bmerc',
    SPIN: 'spin',
    BANK: 'bank',
    STEAK_MARKET: 'steakmarket',
    TEMPLE: 'temple',
    FISHING_CHARTER: 'charter',
    EXPEDITION: 'expedition',
    PET_SHOP: 'pets',
    WELL: 'well',
    EXCHANGE_CENTER: 'exchange',
    HOUSE_OF_CARDS: 'cardshop',
    ART_GALLERY: 'gallery',
    POST_OFFICE: 'postoffice',
    LOCKSMITH: 'locksmith',
    COMMUNITY_CENTER: 'comm',
    REDBROOK_ADVENTURES: 'radv',
    MUSEUM: 'museum',
    SCHOOLHOUSE: 'schoolhouse',
    LIBRARY: 'wiki',
    TOWN_HALL: 'townhall',
});

const GamePagesEnum = Object.freeze({
    ...NavBarLinks,
    ...HomePageLinks,
    ...TownPageLinks,

    ITEM: 'item',
    QUEST: 'quest',
    MAILBOX: 'mailbox',
});

export default GamePagesEnum;
