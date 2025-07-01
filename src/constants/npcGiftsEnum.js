const SUPER_LOVE_GIFTS = [
    'Heart Container',
    'Bouquet of Flowers',
];

const NPCGiftsEnum = Object.freeze({
    ROSALIE: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Gold Carrot',
            'Green Dye',
            'Valentines Card',
            'Blue Dye',
            'Purple Dye',
            'Red Dye',
            'Box of Chocolate 01'
        ],
        LIKES: [
            'Aquamarine',
            'Apple',
            'Carrot',
            'Iced Tea',
            'Purple Flower',
            'Apple Cider',
            'Fireworks',
            'Caterpillar'
        ],
        HATES: [
            'Worms',
            'Fish Bones',
            'Iron Cup',
            'Grubs',
            'Spider',
            'Fire Ant',
            'Coal',
            'Old Boot',
            'Horned Beetle',
            'Carp'
        ],
    },
    HOLGER: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Wooden Table',
            'Gold Trout',
            'Mug of Beer',
            'Potato'
        ],
        LIKES: [
            'Largemouth Bass',
            'Peas',
            'Bluegill',
            'Trout',
            'Arrowhead',
            'Peach',
            'Horn',
            'Cheese',
            'Apple Cider',
            'Carp',
            'Mushroom Stew'
        ],
        HATES: [
            'Aquamarine',
            'Worms',
            'Milk',
            'Valentines Card'
        ]
    },
    BEATRIX: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Black Powder',
            'Iced Tea',
            'Explosive',
            'Fireworks'
        ],
        LIKES: [
            'Bird Egg',
            'Hammer',
            'Oak',
            'Coal',
            'Hops',
            'Carbon Sphere'
        ],
        HATES: [
            'Worms',
            'Grubs',
            'Fire Ant',
            'Horned Beetle'
        ],
    },
    THOMAS: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Fishing Net',
            'Flier',
            'Gold Catfish',
            'Gold Trout',
            'Goldgill'
        ],
        LIKES: [
            'Largemouth Bass',
            'Drum',
            'Minnows',
            'Iced Tea',
            'Gummy Worms',
            'Mealworms',
            'Carp'
        ],
        HATES: [
            'Worms',
            'Green Dye',
            'Eggs',
            'Leek'
        ]
    },
    CECIL: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'MIAB',
            'Shiny Beetle',
            'Old Boot',
            'Grasshopper',
            'Yarn',
            'Horned Beetle',
            'Leather'
        ],
        LIKES: [
            'Aquamarine',
            'Grapes',
            'Snail',
            'Slimestone',
            'Ladder',
            'Giant Centipede'
        ],
        HATES: [
            'Feathers',
            'Mushroom',
            'Worms',
            'Milk'
        ]
    },
    GEORGE: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Perfect Paint Palette'],
        LOVES: [
            'Hide',
            'Spider',
            'Apple Cider',
            'Carbon Sphere',
            'Mug of Beer'
        ],
        LIKES: [
            'Glass Orb',
            'Bird Egg',
            'Arrowhead',
            'Orange Juice',
            'Hops',
            'Mushroom Stew'
        ],
        HATES: [
            'Worms',
            'Fish Bones',
            'Bone',
            'Cheese'
        ]
    },
    JILL: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Refined Corn Quartz'],
        LOVES: [
            'Yellow Perch',
            'Mushroom Paste',
            'MIAB',
            'Peach',
            'Leather'
        ],
        LIKES: [
            'Tomato',
            'Milk',
            'Grapes',
            'Old Boot',
            'Cheese',
            'Scrap Metal'
        ],
        HATES: [
            'Worms',
            'Stingray',
            'Grubs',
            'Spider',
            'Hops',
            'Snowball'
        ]
    },
    VINCENT: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Mushroom Paste',
            'Lemonade',
            'Onion Soup',
            'Axe',
            'Orange Juice',
            '5 Gold',
            'Apple Cider'
        ],
        LIKES: [
            'Apple',
            'Shovel',
            'Horn',
            'Cheese',
            'Hops',
            'Leather Diary',
            'Wooden Box',
            'Acorn'
        ],
        HATES: [
            'Aquamarine',
            'Worms',
            'Purple Parchment',
            'Valentines Card',
            'Purple Flower',
            'Shrimp'
        ]
    },
    LORN: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Milk',
            'Glass Orb',
            'Gold Peas',
            'Small Prawn',
            'Shrimp'
        ],
        LIKES: [
            'Peas',
            'Purple Parchment',
            'Iron Cup',
            '3-leaf Clover',
            'Iced Tea',
            'Bucket',
            'Apple Cider',
            'Green Parchment'
        ],
        HATES: [
            'Worms',
            'Crappie',
            'Snail',
            'Spider',
            'Old Boot'
        ]
    },
    BUDDY: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Pirate Bandana',
            'Valentines Card',
            'Purple Flower',
            'Pirate Flag'
        ],
        LIKES: [
            'Mushroom',
            'Bone',
            'Gummy Worms',
            'Snail',
            'Spider',
            'Bucket',
            'Giant Centipede',
            'Gold Peppers'
        ],
        HATES: [
            'Worms',
            'Drum',
            'Crappie',
            'Lemon',
            'Lemonade',
            'Grubs',
            'Peppers',
            'Snowball'
        ]
    },
    BORGEN: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Gold Catfish',
            'Cheese',
            'Wooden Box'
        ],
        LIKES: [
            'Milk',
            'Glass Orb',
            'Gold Carrot',
            'Slimestone',
            'Gold Peas',
            'Gold Cucumber'
        ],
        HATES: [
            'Worms',
            'Grubs',
            'Green Dye',
            'Valentines Card',
            'Old Boot',
            'Purple Flower'
        ]
    },
    RIC_RYPH: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Five Point Mace'],
        LOVES: [
            'Mushroom Paste',
            'Shovel',
            'Hammer',
            '5 Gold'
        ],
        LIKES: [
            'Black Powder',
            'Bucket',
            'Arrowhead',
            'Coal',
            'Old Boot',
            'Carbon Sphere',
            'Unpolished Shimmer Stone',
            'Green Parchment'
        ],
        HATES: [
            'Aquamarine',
            'Worms',
            'Milk',
            'Valentines Card',
            'Ladder',
            'Cheese',
            'Caterpillar'
        ]
    },
    MUMMY: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Bone',
            'Spider',
            'Valentines Card'
        ],
        LIKES: [
            'Fish Bones',
            'Hammer',
            'Yarn',
            'Treat Bag 02'
        ],
        HATES: [
            'Worms',
            'Drum',
            'Coal',
            'Cheese',
            'Box of Chocolate 01',
            'Snowball'
        ]
    },
    STAR_MEERIF: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Ramjoram\'s Mask'],
        LOVES: [
            'Gold Feather',
            'Blue Feathers'
        ],
        LIKES: [
            'Feathers',
            'Eggs'
        ],
        HATES: [
            'Worms',
            'Bone',
            'Lemon',
            'Lemonade',
            'Iron Cup',
            'Grubs',
            'Cheese'
        ]
    },
    CHARLES: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Apple',
            'Gold Carrot',
            'Valentines Card',
            'Peach',
            'Apple Cider',
            'Box of Chocolate 01'
        ],
        LIKES: [
            'Carrot',
            '3-leaf Clover',
            'Twine',
            'Grasshopper'
        ],
        HATES: [
            'Worms',
            'Stone',
            'Bone',
            'Lemon',
            'Lemonade',
            'Grubs',
            'Snail',
            'Spider',
            'Cheese',
            'Green Chromis',
            'Blue Crab'
        ]
    },
    ROOMBA: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Refined Corn Quartz'],
        LOVES: [
            'Carbon Sphere',
            'Scrap Metal'
        ],
        LIKES: [
            'Glass Orb',
            'Scrap Wire',
            'Hammer'
        ],
        HATES: [
            'Worms',
            'Milk',
            'Bird Egg',
            '3-leaf Clover',
            'Arrowhead',
            'Snowball',
            'Acorn'
        ]
    },
    CPT_THOMAS: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Fishing Net',
            'Gold Catfish',
            'Large Net',
            'Gold Drum',
            'Gold Trout'
        ],
        LIKES: [
            'Minnows',
            'Blue Crab'
        ],
        HATES: [
            'Radish',
            'Worms',
            'Spider'
        ]
    },
    FRANK: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Gold Carrot',
            'Carrot'
        ],
        LIKES: [
            'Feathers',
            'Blue Feathers',
            'Bucket',
            'Blue Dye',
            'Grasshopper',
            'Caterpillar'
        ],
        HATES: [
            'Mushroom',
            'Worms',
            'Peas',
            'Trout',
            'Fire Ant',
            'Eggs'
        ]
    },
    MARIYA: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Shrimp-a-Plenty',
            'Onion Soup',
            'Over The Moon',
            'Quandary Chowder',
            'Cat\'s Meow',
            'Sea Pincher Special',
            'Leather Diary',
            'Mushroom Stew'
        ],
        LIKES: [
            'Radish',
            'Cucumber',
            'Eggplant',
            'Milk',
            'Iced Tea',
            'Peach',
            'Eggs'
        ],
        HATES: [
            'Worms',
            'Black Powder',
            'Spider',
            'Explosive'
        ]
    },
    BABA_GEC: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Cabbage Stew',
            'Peach Juice',
            'Wooden Button'
        ],
        LIKES: [
            'Onion',
            'Rope',
            'Snail',
            'Leek'
        ],
        HATES: [
            'Worms',
            'Stone',
            'Horned Beetle'
        ]
    },
    GEIST: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Prism Shell'],
        
        LOVES: [
            'Gold Catfish',
            'Shrimp-a-Plenty',
            'Sea Pincher Special',
            'Goldgill'
        ],
        LIKES: [
            'Yellow Perch',
            'Stingray',
            'Green Chromis',
            'Blue Crab'
        ],
        HATES: [
            'Worms',
            'Black Powder',
            'Gummy Worms',
            'Explosive',
            'Axe'
        ]
    },
    GARY_BEARSON_V: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS, 'Gare Bear'],
        LOVES: [
            'Yarn',
            'Gold Trout',
            'You Rock Card',
            'Apple Cider'
        ],
        LIKES: [
            'Feathers',
            'Trout',
            'Oak'
        ],
        HATES: [
            'Tomato',
            'Radish',
            'Worms',
            'Black Powder',
            'Bucket'
        ]
    },
    CID: {
        SUPER_LOVES: [...SUPER_LOVE_GIFTS],
        LOVES: [
            'Spider',
            'Explosive',
            'Diamonds',
            'Bomb',
            'Mushroom Stew',
            'Safety Goggles'
        ],
        LIKES: [
            'Stone',
            'Black Powder',
            'Blue Feathers',
            'Shimmer Stone'
        ],
        HATES: [
            'Worms',
            'Cheese'
        ]
    },
});

const makeItemGiftsEnum = (gifts) => {
    const items = {};
    const npcs = Object.keys(gifts);

    npcs.forEach((npc) => {
        const { SUPER_LOVES, LOVES, LIKES, HATES } = gifts[npc];
        const giftLevel = [[SUPER_LOVES, 'SUPER_LOVES'], [LOVES, 'LOVES'], [LIKES, 'LIKES'], [HATES, 'HATES']];

        giftLevel.forEach(([level, levelName]) => {
            level.forEach((item) => {
                if (!items[item]) {
                    items[item] = {};
                }

                if (!items[item][levelName]) {
                    items[item][levelName] = [];
                }

                items[item][levelName].push(npc);
            });
        });

    });

    return Object.freeze(items);
};

const ItemGiftsEnum = makeItemGiftsEnum(NPCGiftsEnum);

export default NPCGiftsEnum;
export {
    ItemGiftsEnum, NPCGiftsEnum
};

