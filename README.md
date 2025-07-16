
# 👨‍🌾🚜 FarmRPG Plus

This userscript its a collection of navigation, visual and informational features I thought would be a good fit for the player's experience.

Inspired by:
- [@anstosa](https://farmrpg.com/#!/profile.php?user_name=anstosa) - [farmrpg-farmhand](https://github.com/anstosa/farmrpg-farmhand/tree/main)
- [@coderanger](https://farmrpg.com/#!/profile.php?user_name=coderanger) - [farmrpg-etx](https://github.com/coderanger/farmrpg-ext)

Any feedback, ideas, requests, bugs or tips can be send to my ingame DM and Mailbox [@Synogun](https://farmrpg.com/#!/profile.php?user_name=Synogun)

All changes are documented on the [Changelog](CHANGELOG.md).

## 🤔💭 Considerations

> X. Cheating may be subject to an immediate ban.
> (A) Do not use any form of botting, scripting, macros, etc. Just don’t. While FarmRPG is non-competitive, using any sort of hardware device, script, bot, macro, etc to play the game in an automated fashion is strictly forbidden. Do not discuss this topic in any public forum within the FarmRPG platform. Automation in the game causes a large amount of server requests and bandwidth usage that can impact game play for the entire community.

The userscript strictly follows the game's [Code Of Conduct](https://farmrpg.com/#!/coc.php), therefore, not automating or performing any actions in place of the player.

This userscript its not an official part of the Farm RPG.\
*Magic & Wires LLC.* are not responsible in any way for the errors introduced by this userscript and along with the game staff should not be bother in any way about it, for contact refer to [section above](#-farmrpg-plus).

## 💾 About data saved

The script saves data in the browser's local storage, which is not shared between devices or browsers.\
This means that if you switch browsers or devices, your data will not be carried over.

All data saved is related to the script's features and settings, such as:
- Features enabled/disabled
- Settings for each feature
- Cached data for performance improvements

Know that the script does not save any personal data, such as your FarmRPG account information or any other sensitive data.

### If something seems broken, try resetting the script's data by going to the settings page and clicking on "Reset FarmRPG Plus Data". This will clear all saved data and restore the script to its default state.

## ⬇ How to Install and Use

## 💻 Setting Up on Desktop

To install the script on desktop, follow these steps:

- **Step 1: Use a compatible browser**  
  Choose a browser that allows extensions. Firefox is a great option and works on both desktop and mobile.

- **Step 2: Install a userscript manager**  
  Add an extension like **Violentmonkey**/**Tampermonkey**, or if you're on iOS, try **Userscripts**.

- **Step 3: Add the FarmRPG Plus script**  
  Install from the [script file](https://raw.githubusercontent.com/Synogun/FarmRPGPlus/refs/heads/main/dist/FarmRPGPlus.user.js).

<!-- ## 📱 Setting Up on Mobile

Mobile setup is slightly different but just as easy:

- **Step 1: Install the Userscripts app**  
  This app lets your browser run custom scripts, which adds extra functionality to FarmRPG.

- **Step 2: Get the Farmhand script**  
  Visit [Greasy Fork](https://greasyfork.org) or the script’s repository to install **Farmhand**.

- **Step 3: Pin FarmRPG to your home screen**  
  Open [https://farmrpg.com](https://farmrpg.com) in your browser, then use the browser menu to add it to your home screen — making it launch like a native app. -->

## ✨ Features

### ⚙ Modular Features

All features can be turned ON/OFF independently, you can check it out in-game:

> [My Settings -> Change Game Options](https://farmrpg.com/#!/settings_options.php) -> FarmRPG Plus Settings (at the bottom of the page)

### 📚 Buddy Farm and Library Buttons

There's a ton of Buddy Farm and Library buttons throughout the game pages, usually at the bottom so it don't clutter the interface.
Each button can be disabled individually and independently.

### ♻ Crafting Bonus Indicator

Adds a crafting bonus indicator on the items of Workshop page, showing how much bonus resources will be crafted with the resource saver perk.

### 🔥 Oven Navigation Buttons

Adds a previous and next button inside the Ovens page, making cooking actions less painfull while not having the group actions buttons.

### ➗ Farm Supply Discount Label

Calculates the discount factor for perks on SALE and adds a label next to the buy button.

### ✅ Items Collected Indicator

Adds a small indicator on item page next to the image, indicating if the item has been collected along the game or not.
The indicator synchronizes whenever navigating to the museum page, inventory page or item page (and quantity on hand/in storage its greater than zero).

### 🥤🎃 Pumpkin Juice Goal Indicator

Modifies the Pumpkin Juice button to show the amount of Pumpkin Juice needed to reach the next mastery tiers for the item.

### 📅 Event Features

#### 🚀 Bottle Rocket Brawl

Display statistics about the attacks made and tokens earned, also, adds two history lists, one for attack history and one for last players attacked. The size of history logs can be set in the settings.
