# Changelog

## v3.1.1 - hotfix
Noticed a major bug in Lore Codex Storylines, fixed it.

## v3.1.0 - 11-29-2025

**Important:** You need [Node.js](https://nodejs.org/) installed to run this app. Check the [README](https://github.com/chatelainedev/creators-toolkit?tab=readme-ov-file#creators-toolkit-v310) for full setup details.

### What Got Fixed

**Lore Codex**
- The "Hidden" banner size actually hides the container now like it's supposed to
- Events filter correctly based on both their Character Tags and Arc Filter Tags
- Navigation styles with transparent backgrounds are actually transparent now
- Tweaked the Character profile Info Display dimensions to look better

**Notebook**
- Collections collapse correctly and expand more smoothly
- It's clearer when your Note has been saved

**CoWriter**
- You can name folders properly now
- The Load modal shows accurate message counts
- Fixed an error that prevented regenerating messages in saved chats
- Gemini model list pulls the latest text completion models (I can't test OpenAI much since I don't have a subscription, but it should work)

### What's New

**General App Updates**
- AI Configuration settings accessible in main app Settings
- Markdown Theme settings accessible in main app Settings  
- New SVG icons for Tools, better theme color integration throughout, general styling improvements

**Lore Codex**
- New "Separate" banner size - puts the banner at the top of the screen with a gap between it and the main container. Looks really clean with the transparent banner styles
- Storylines can have Timing assigned so they show as spans on the Plans page Timeline
- Events can be marked as "Yearly" to repeat every year (great for birthdays or annual festivals)
- You can add background images to events that appear on event cards in the Timeline

**CoWriter**
- Added OpenRouter as a provider option, including a setting to only show free models

### Known Issues

- Logging out from anywhere except the main app will redirect you back to the app instead of the login screen
- The flickering Overview backgrounds in Lore Codex seem to be fixed, but let me know if you're still seeing it
- RP Archiver: importing jsonl files sometimes adds extra whitespace after character names in the first message
- Tags and favorites occasionally disappear in My Sites - they're not lost (check preferences.backup in your userID folder), but this bug keeps popping up

### How to Update
1. **IMPORTANT**: Copy your `users/` folder before updating (this has all your data - if you have this, you can't lose anything) 
2. Two options:
    a. Manual: 
    - Download v3.0.0 and unzip it wherever you want
    - Paste your `users/` folder into the new `creators-toolkit-3.1.0` folder
    b. update.bat: 
    - Run the update.bat file in your `creators-toolkit-3.0.0` folder
    - Your version will download from Github and update automatically
3. Run `start-server.bat` or `start-server.sh`
4. All your data will be there

As always: Your data stays on your computer. No internet needed after setup. Report bugs on GitHub Issues.

---

## Creator's Toolkit 3.0.0 - 11/18/2025

The big feature this time is the **Time Systems Editor** in Lore Codex, which lets you build completely custom calendars for your projects.

**Important:** You need [Node.js](https://nodejs.org/) installed to run this app. Check the [README](https://github.com/chatelainedev/creators-toolkit?tab=readme-ov-file#creators-toolkit-v300) for full setup details.

### What's New

**Time Systems Editor (Lore Codex)**
- Create unique time systems for your projects
- Build solar or lunar-based calendars with custom eras
- Define how many weekdays and months you want, name them whatever you like
- Make custom seasons with their own names and colors
- Assign a time system to your project and pick dates for events from your custom calendar
- Mark events as "yearly" to make them repeat automatically on the timeline

**RP Archiver**
- You can import roleplay chats directly from SillyTavern, `.txt`, or `.jsonl` files now

**Lore Codex**
- Arc and Sub-Arc badges show up on Plans in the generated HTML for better visual organization

### What Changed

**Lore Codex Timeline Improvements**
- Event markers are colored based on their Arc
- Event backgrounds reflect the season and color you set in Time Systems Editor
- Better tooltips
- Importing storylines auto-fills relevant fields from RP Archiver files

### What Got Removed

**Arc Swimlane Timeline (Lore Codex)** - This view wasn't working well, so I'm focusing on making the chronological timeline better instead.

### What Got Fixed

**General**
- User settings for AI Tools and custom themes save correctly to `accounts.json` now
- Fixed a bug that made the email field required when toggling AI Tools (only username and password are actually required)
- Minor stability improvements to account and login system

**Lore Codex**
- Playlists save properly now and the Save button actually responds
- Subsection headers show consistently in Storylines
- "Back to Top" button on Timeline matches the style of other buttons
- Preview window expands to full size like it should

**RP Archiver**
- Preview window applies your custom CSS correctly
- Fixed export failing when trying to export a single, non-part story as a text file

### Known Issues

- Logging out from anywhere except the main dashboard redirects to the app instead of login screen
- Overview background flickering in Lore Codex should be fixed, but [let me know](https://github.com/chatelainedev/creators-toolkit/issues) if you still see it

### How to Update
1. **IMPORTANT**: Copy your `users/` folder before updating (this has all your data - if you have this, you can't lose anything) 
2. Two options:
    a. Manual: 
    - Download v3.0.0 and unzip it wherever you want
    - Paste your `users/` folder into the new `creators-toolkit-3.0.0` folder
    b. update.bat: 
    - Run the update.bat file in your `creators-toolkit-2.1.0` folder
    - Your version will download from Github and update automatically
3. Run `start-server.bat` or `start-server.sh`
4. All your data will be there

As always: Your data stays on your computer. No internet needed after setup. Report bugs on GitHub Issues.

---

## v2.1.0 - 11/13/2025

### What's New

**App-Wide Changes**
- Renamed "Generate" buttons to "Create" throughout the app
- Refreshed some UI images
- CoWriter and Character/Lorebook Managers are disabled by default now - turn them on in User Settings if you want to use the AI features

**Lore Codex**

New stuff:
- **Character Info Display** - RPG-style stat display for character profiles. Turn it on globally in Characters category settings, then toggle per character. Shows curated info in a styled section with alternate styles in the Appearance tab
- **World Entry Icons** - Make custom icons for Magic, Cultivation, and Items entries. They show up in Character Info Display
- **Section Renaming** - Rename World categories (Culture, Magic, Cultivation, Events) to fit your project
- **Faction Organization** - Control how Factions display on the Characters page in generated HTML

Fixes:
- Custom Pages don't include unnecessary CSS for horizontal link containers anymore
- Cleaned up Character Subcontainer styles in Appearance tab - reduced margins, improved Minimal Style, fixed Tab style layout

**Lorebook Manager**

New stuff:
- **Find/Replace** - Search and replace across lorebook entries
- **Advanced Options** - More settings for individual entries
- **Add Category Button** - Create categories with a button instead of just the Enter key
- **Copy Context Menu** - Right-click entries to quickly copy content

Fixes:
- Fixed bugs affecting categories
- Better exported plaintext format with standard markdown dividers

### Known Issues
- Overview backgrounds in Lore Codex might flicker
- HTML Preview needs work for Lore Codex and RP Archiver
- Image hover alignment for World items needs fixing
- Subheaders in Storylines show up incorrectly with filters applied
- Save button styling in playlist modal needs correction
- The update.bat doesn't work - you'll need to update manually if you use this version

### Coming Soon
- Bulk Edit for Character Manager
- More category customization in Lore Codex
- File upload for roleplays in RP Archiver

### How to Update
1. **IMPORTANT**: Copy your `users/` folder before updating (this has all your data - if you have this, you can't lose anything)
2. Download v2.1.0 and unzip it wherever you want
   - Note: update.bat from older versions (v1.0.0, v2.0.0) isn't working, you'll need to update manually
3. Paste your `users/` folder into the new `creators-toolkit-2.1.0` folder
4. Run `start-server.bat` or `start-server.sh`
5. All your data will be there
6. If you're using AI features, remember to enable them in User Settings

Note: When toggling AI Tools in User Settings, it might say email is required. Just put anything (like email@email.com) - it's not actually used or saved anywhere except your own computer. I'll fix this next update.

As always: Your data stays on your computer. No internet needed after setup. Report bugs on GitHub Issues.

---

## v2.0 - 10/2025

### What's New

**Lore Codex**

New stuff:
- **Magic Category** - Added to World items for organizing magical systems and supernatural elements
- **Storyline Organization** - Section headers and subheaders supported now, with an Options menu to toggle visibility
- **Faction Assignment** - Assign Characters to Factions (from World items) and they'll organize by Faction in generated HTML automatically. Toggle this in the new Character Options menu
- **Lorebook Integration** - Export button shows up next to World header in generated HTML when you link a lorebook to your project
- **Character Cards** - Attach character cards to Characters. Right-click character images in generated HTML to download
- **Better Tag System** - New syntax `tagname(#color1 #color2 #color3)` for custom tag colors, text colors, and hover effects

**New Tools**

Character Manager:
- Import or create character cards for AI roleplay platforms
- Add alternate fields and avatars to cards
- Organize cards into folders
- Export in various formats

Lorebook Manager:
- Import or create lorebooks for AI roleplay platforms
- Edit existing entries or make new ones
- Organize entries into collapsible categories
- Hide categories and export only what's visible
- Bulk edit multiple entries
- AI Helper for generating entry suggestions

**General Improvements**
- User selection dropdown on login screen
- "Login as Guest" option to explore without making an account
- More color themes
- Your User ID shows in Settings now
- New Managers dropdown in main navigation for quick access to Character and Lorebook Managers

### Other Improvements

- Projects and HTML files can be renamed by right-clicking the project dropdown
- General styling improvements across all tools
- Fixed bug where lorebooks would carry over between projects incorrectly
- Subarc event links work properly in generated HTML now

### Notes

- Old project folders don't delete automatically when you rename - delete them manually or keep them as backups
- For existing projects, you might need to re-link lorebooks after updating

### How to Update
(If you're coming from v1.0.0)

1. **IMPORTANT**: Copy your `users/` folder before updating (this has all your data - if you have this, you can't lose anything)
2. Download v2.0.0 and unzip it wherever you want
   - Note: update.bat from older versions (v1.0.0) isn't working, you'll need to update manually
3. Paste your `users/` folder into the new `creators-toolkit-2.0.0` folder
4. Run `start-server.bat` or `start-server.sh`
5. All your data will be there

**IMPORTANT**: If this is your first install, install [Node](https://nodejs.org/en) first.

As always: Your data stays on your computer. No internet needed after setup. Report bugs on GitHub Issues.

---

## v1.0 - Initial Release - 9/20/2025

### Quick Start

1. Install Node.js from https://nodejs.org/
2. Extract the project folder
3. Run `start-server.bat` (Windows) or `start-server.sh` (Mac/Linux)
4. Wait for setup (1-2 minutes first time)
5. Open http://localhost:3000 in your browser

Check README.md for detailed instructions.

### What You Get

- File-based user accounts with password security
- Three writing tools in one package
- Works offline after initial setup
- Cross-platform (Windows, Mac, Linux)
- Export to HTML and ZIP

### Known Issues

- Card transparency in Lore Codex Solos view needs adjustment
- The update.bat doesn't work - you'll need to update manually if you use this version