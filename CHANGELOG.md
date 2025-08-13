# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/heads/develop/dist/FarmRPGPlus.user.js)

### Added
- `VaultPage` - Adds Enter Hotkey feature, which binds the Enter keyboard key to Send and Guess (if guesser feature its active) buttons.
- `HomePage` - Adds Color select configuration for Highlight Row feature, allowing users to choose the highlight color.

### Changed
- `VaultPage` - Adopts extra stategy for code suggester, injecting untested digits into blue positions to make better use of space.

### Fixed
- `VaultPage` - Fixes yellow filtering not filtering codes which did not contain the yellow digit in the remaining spaces.
- `ItemPage` - Fixes Pumpkin Juice Indicator not displaying correctly when the player has 0 mastery on the item.

## [v1.8.2](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/v1.8.2/dist/FarmRPGPlus.user.js)

### Added
- `HomePage` - Adds Highlight Row feature, which highlights specific rows if they are ready for interaction.
- `HomePage` - Adds Reset Checklist feature, which adds a list on the bottom of the home page with all the common daily tasks.
- `HomePage` - Adds Announcements feature, which displays new updates announcements on the top of home page.

### Changed
- `VaultPage` - Improves code suggester to handle more complex code patterns and provide better suggestions. The algorithm now is able to crack every single vault code (0001-9999).
- `Several Pages` - Removes unnecessary debug messages to clean up the console output.

### Fixed
- `SettingsPlus` - Fixes verification of feature value in `isFeatureEnabled` causing features not being disabled properly.
- `main | RouterPlus` - Fixes callback handling in the main script, which wasn't properly receiving the callback from the router.

## [v1.5.3](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/v1.5.3/dist/FarmRPGPlus.user.js)

### Added
- `HomePage` - Adds Hide Maxed Skills feature, which hides skills that are already maxed out on the home page.
- `SettingsPlus` - Adds additional settings for several features.
- `ItemPage` - Adds Pumpkin Juice Indicator, showing how many uses its needed to reach mastery.
- `SettingsPlus` - Adds a more robust feature registration and management, allowing better handling of feature defaults and configurations.

### Changed
- `ItemPage` - Changes NPC likings cards positions to be the last card on the page, as it is mostly for reference.
- `FarmRPGPlusError` - Changes error handling to use now properly throw the `FarmRPGPlusError`.

### Fixed
- `SettingsOptionsPage` - Fixes the hidden old configs making feature enablers not display correctly.
- `WorkshopPage` - Fixes crafting bonus text not displaying commas for large numbers.
- `OvenPage` - Fixes navigation buttons not displaying correctly when a meal is complete.

## [1.2.1](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/v1.2.1/dist/FarmRPGPlus.user.js)

### Added
- `WorkshopPage` - Adds crafting bonus (resource saver) indicator to the Workshop page.

### Changed

### Fixed
- `StoragePlus` - Fixes StoragePlus not correctly handling the storage initialization.

## [1.1.0](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/tags/1.1.0/dist/FarmRPGPlus.user.js)

### Added
- `Settings` - Adds a settings options for all features currently available.
- `SettingsOptionsPage` - Adds SettingsOptionsPage for the user enable/disable available features.
- `SettingsPlus` - Adds SettingsPlus module for managing userscript settings.
- `MuseumPage` - Adds collected indicator cache syncronization to the Museum page.
- `InventoryPage` - Adds a collected indicator cache syncronization to the Inventory page.
- `VaultPage` - Adds a really basic code suggester to the Vault page.
- `VaultPage` - Adds a library button to the Vault page.
- `ItemPage` - Adds a collected indicator to item pages, showing if the item is collected.
- `ItemPage` - Adds sorting to Npc likings cards by Super Loves, Loves, Likes and Hates.

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
