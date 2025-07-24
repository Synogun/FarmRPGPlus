import TimeControl from '../utils/timeControl';

const NavBarLinks = Object.freeze({
    HOME: 'index-1',
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
    HELP_NEEDED: 'quests',
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
    BORGENS_CAMP: TimeControl.isTodayWednesday() ? 'borgen_camp' : 'wiki.php?page=Borgen\'s%20Camp',
    BORGEN_MERCANTILE: 'bmerc',
    WHEEL_OF_BORGEN: 'spin',
    BANK: 'bank',
    VAULT: 'crack',
    STEAK_MARKET: 'steakmarket',
    TEMPLE: 'temple',
    FISHING_CHARTER: 'charter',
    EXPEDITION: 'expedition',
    PET_SHOP: 'pets',
    WISHING_WELL: 'well',
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

const ExplorePageLinks = Object.freeze({
    EXPLORE: 'explore',
    FOREST: 'area.php?id=7',
    SMALL_CAVE: 'area.php?id=1',
    SMALL_SPRING: 'area.php?id=2',
    HIGHLAND_HILLS: 'area.php?id=3',
    CANE_POLE_RIDGE: 'area.php?id=4',
    MISTY_FOREST: 'area.php?id=5',
    BLACK_ROCK_CANYON: 'area.php?id=6',
    MOUNT_BANON: 'area.php?id=8',
    EMBER_LAGOON: 'area.php?id=9',
    WHISPERING_CREEK: 'area.php?id=10',
    JUNDLAND_DESERT: 'area.php?id=13',
    GARY_CRUSHROOM: 'area.php?id=20',
    EXPEDITION: 'expedition.php',
});

const ExploreInfoPageLinks = Object.freeze({
    FOREST_INFO: 'location.php?type=explore&id=7',
    SMALL_CAVE_INFO: 'location.php?type=explore&id=1',
    SMALL_SPRING_INFO: 'location.php?type=explore&id=2',
    HIGHLAND_HILLS_INFO: 'location.php?type=explore&id=3',
    CANE_POLE_RIDGE_INFO: 'location.php?type=explore&id=4',
    MISTY_FOREST_INFO: 'location.php?type=explore&id=5',
    BLACK_ROCK_CANYON_INFO: 'location.php?type=explore&id=6',
    MOUNT_BANON_INFO: 'location.php?type=explore&id=8',
    EMBER_LAGOON_INFO: 'location.php?type=explore&id=9',
    WHISPERING_CREEK_INFO: 'location.php?type=explore&id=10',
    JUNDLAND_DESERT_INFO: 'location.php?type=explore&id=13',
    GARY_CRUSHROOM_INFO: 'location.php?type=explore&id=20',
});

const FishingPageLinks = Object.freeze({
    FISHING: 'fish',
    FARM_POND: 'fishing.php?id=2',
    SMALL_POND: 'fishing.php?id=1',
    FOREST_POND: 'fishing.php?id=3',
    LAKE_TEMPEST: 'fishing.php?id=4',
    SMALL_ISLAND: 'fishing.php?id=5',
    CRYSTAL_RIVER: 'fishing.php?id=6',
    EMERALD_BEACH: 'fishing.php?id=7',
    VAST_OCEAN: 'fishing.php?id=8',
    LAKE_MINERVA: 'fishing.php?id=9',
    LARGE_ISLAND: 'fishing.php?id=10',
    PIRATES_COVE: 'fishing.php?id=11',
    GLACIER_LAKE: 'fishing.php?id=12',
    CHARTER: 'charter.php'
});

const FishingInfoPageLinks = Object.freeze({
    FARM_POND_INFO: 'location.php?type=fishing&id=2',
    SMALL_POND_INFO: 'location.php?type=fishing&id=1',
    FOREST_POND_INFO: 'location.php?type=fishing&id=3',
    LAKE_TEMPEST_INFO: 'location.php?type=fishing&id=4',
    SMALL_ISLAND_INFO: 'location.php?type=fishing&id=5',
    CRYSTAL_RIVER_INFO: 'location.php?type=fishing&id=6',
    EMERALD_BEACH_INFO: 'location.php?type=fishing&id=7',
    VAST_OCEAN_INFO: 'location.php?type=fishing&id=8',
    LAKE_MINERVA_INFO: 'location.php?type=fishing&id=9',
    LARGE_ISLAND_INFO: 'location.php?type=fishing&id=10',
    PIRATES_COVE_INFO: 'location.php?type=fishing&id=11',
    GLACIER_LAKE_INFO: 'location.php?type=fishing&id=12',
});

const MyFarmPageLinks = Object.freeze({
    CHICKEN_COOP: 'coop.php',
    COW_PASTURE: 'pasture.php',
    PIG_PEN: 'pigpen.php',
    STOREHOUSE: 'storehouse.php',
    FARMHOUSE: 'farmhouse.php',
    RAPTOR_PEN: 'pen.php',
    GRAPE_JUICE_VAT: 'grapejuicevat.php',
    WINE_CELLAR: 'cellar.php',
});

const EventPageLinks = Object.freeze({
    BOTTLE_ROCKET: 'Bottle-Rocket-Brawl'
});

const SinglePageLinks = Object.freeze({
    OVEN: 'oven',
    ITEM: 'item',
    QUEST: 'quest',
    MAILBOX: 'mailbox',
});

const MiscPageLinks = Object.freeze({
    SETTINGS: 'settings',
    SETTINGS_OPTIONS: 'settings_options'
});

const ItemPageLinks = Object.freeze({
    ORANGE_JUICE: 'item.php?id=84',
    LEMONADE: 'item.php?id=86',
    APPLE_CIDER: 'item.php?id=379',
    ARNOLD_PALMER: 'item.php?id=508',
    ANTLER: 'item.php?id=170',
    MILK: 'item.php?id=85',
    FEATHERS: 'item.php?id=42',
    EGGS: 'item.php?id=26',
    TROUT: 'item.php?id=63',
});

const GamePagesEnum = Object.freeze({
    ...NavBarLinks,
    ...HomePageLinks,
    ...MyFarmPageLinks,
    ...TownPageLinks,
    ...ExplorePageLinks,
    ...ExploreInfoPageLinks,
    ...FishingPageLinks,
    ...FishingInfoPageLinks,
    ...EventPageLinks,
    ...SinglePageLinks,
    ...MiscPageLinks,
    ...ItemPageLinks,
});

export default GamePagesEnum;

export {
    EventPageLinks, ExploreInfoPageLinks, ExplorePageLinks,
    FishingInfoPageLinks, FishingPageLinks, GamePagesEnum,
    HomePageLinks, ItemPageLinks, MiscPageLinks, MyFarmPageLinks,
    NavBarLinks, SinglePageLinks, TownPageLinks
};

