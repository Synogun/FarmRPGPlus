
const MasteryTiersEnum = {
    TIER_I: 100,
    TIER_II: 1_000,
    MASTERY: 10_000,
    GRAND_MASTERY: 100_000,
    MEGA_MASTERY: 1_000_000,
};

const MasteryTiersDisplayEnum = {
    [MasteryTiersEnum.TIER_I]: 'Tier I',
    [MasteryTiersEnum.TIER_II]: 'Tier II',
    [MasteryTiersEnum.MASTERY]: 'M',
    [MasteryTiersEnum.GRAND_MASTERY]: 'GM',
    [MasteryTiersEnum.MEGA_MASTERY]: 'MM',
};

export default MasteryTiersEnum;
export {
    MasteryTiersEnum,
    MasteryTiersDisplayEnum
};
