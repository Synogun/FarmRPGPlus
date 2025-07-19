# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/heads/develop/dist/FarmRPGPlus.user.js)

### Added
- `HomePage` - Added Hide Maxed Skills feature, which hides skills that are already maxed out on the home page.
- `SettingsPlus` - Added additional settings for several features.
- `ItemPage` - Added Pumpkin Juice Indicator, showing how many uses its needed to reach mastery.
- `SettingsPlus` - Added more robust feature registration and management, allowing better handling of feature defaults and configurations.

### Changed
- `ItemPage` - Changed NPC likings cards positions to be the last card on the page, as it is mostly for reference.
- `FarmRPGPlusError` - Changed error handling to use now properly throw the `FarmRPGPlusError`.

### Fixed
- `WorkshopPage` - Fixed crafting bonus text not displaying commas for large numbers.
- `OvenPage` - Fixed navigation buttons not displaying correctly when a meal is complete.

## [1.2.1](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/1.2.1/dist/FarmRPGPlus.user.js)

### Added
- `WorkshopPage` - Added crafting bonus (resource saver) indicator to the Workshop page.

### Changed

### Fixed
- `StoragePlus` - Fixed StoragePlus not correctly handling the storage initialization.

## [1.1.0](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/1.1.0/dist/FarmRPGPlus.user.js)

### Added
- `Settings` - Added settings options for all features currently available.
- `SettingsOptionsPage` - Added SettingsOptionsPage for the user enable/disable available features.
- `SettingsPlus` - Added SettingsPlus module for managing userscript settings.
- `MuseumPage` - Added collected indicator cache syncronization to the Museum page.
- `InventoryPage` - Added collected indicator cache syncronization to the Inventory page.
- `VaultPage` - Added really basic code suggester to the Vault page.
- `VaultPage` - Added library button to the Vault page.
- `ItemPage` - Added collected indicator to item pages, showing if the item is collected.
- `ItemPage` - Sort Npc likings cards by Super Loves, Loves, Likes and Hates.

### Changed
- `StoragePlus` - Made StoragePlus static, removing the need to instantiate it.

### Fixed
- `ESLint` - Fixes ESLint configuration file not recognizing recommended rules.
- `FarmRPGPlusError` - Fixes error messages not displaying correctly.
- `BottleRocketPage` - Fixes attack history being limited.
- `TimeControl` - Fixes reset time function counting 1 minute too short.

## [1.0.0](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/1.0.0/dist/FarmRPGPlus.user.js)

### Added
- Buddy Farm quick access buttons to Home, Item, Quest, and Quests pages.
- NPC likings cards to Item pages, showing which NPCs like/love/super love each item.
- Wishing Well Library card to the Well page with quick links to tips, curios, and wants.
- Oven navigation card to the Oven page for switching between multiple ovens.
- Automatic detection and caching of the player's oven count from the Kitchen page.
- Farm Supply discount display, showing percentage off for discounted upgrades.
- Townsfolk info card to the NPCs page with links to friendship, gifts, and Buddy Farm townsfolk.
- Bottle Rocket event stats, attack history, and player history cards to the Bottle Rocket event page.

### Changed

### Fixed
