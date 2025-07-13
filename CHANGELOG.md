# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]()

### Added
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
