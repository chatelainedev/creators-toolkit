# Changelog

## Creator's Toolkit 3.0.0 - 11/18/2025

This is a major update focused on building richer worlds and improving content integration. The headline feature is the brand-new **Time Systems Editor** in the *Lore Codex*, which allows for the creation of completely custom calendars for your projects.

**Important:** You must have [Node.js](https://nodejs.org/) installed to run this application. Please see the [README](https://github.com/chatelainedev/creators-toolkit?tab=readme-ov-file#creators-toolkit-v300) for full installation and usage details.

---

### Added

*   **[Lore Codex] New Major Feature: The Time Systems Editor!**
    *   Create unique, custom time systems for your projects.
    *   Build solar or lunar-based calendars with custom eras.
    *   Define the number and names of weekdays and months.
    *   Create custom seasons with unique names and color schemes.
    *   Assign a time system to your project and select dates for events directly from your custom calendar.
    *   Designate events as "yearly" to have them automatically repeat on the timeline.
*   **[RP Archiver] Chat Import for Roleplay Text:** You can now directly import your roleplay chats from SillyTavern, `.txt`, or `.jsonl` files.
*   **[Lore Codex] Arc & Sub-Arc Badges:** When viewing Plans in the generated HTML, items will now display colored badges corresponding to their assigned types for better visual organization.

### Changed

*   **[Lore Codex] Chronological Timeline Enhanced:** The timeline has been upgraded to be more dynamic and informative.
    *   Event markers are now colored according to their assigned Arc.
    *   Event backgrounds reflect the custom season and color you've defined in the Time Systems Editor.
    *   Tooltips have been improved for clarity.
*   **[Lore Codex] Smarter Storyline Imports:** Importing a storyline now automatically populates relevant fields from *RP Archiver* files, streamlining your workflow.

### Removed

*   **[Lore Codex] Arc Swimlane Timeline:** This timeline view has been removed. It was not performing as intended, and development efforts will be focused on enhancing the more robust chronological timeline.

### Fixed

*   **General**
    *   User settings for AI Tools and custom themes are now correctly saved to the `accounts.json` file.
    *   Resolved a bug that incorrectly required the email field to be filled out when toggling AI Tools. The only required fields for login are username and password.
    *   Minor stability tweaks to the account and login system.
*   **Lore Codex**
    *   Corrected an issue where Playlists were not saving properly and fixed unresponsive behavior with the "Save" button.
    *   Ensured subsection headers are now consistently visible in Storylines.
    *   The "Back to Top" button on the Timeline now correctly matches the style of other buttons.
    *   The Preview window now expands to its full size as expected.
*   **RP Archiver**
    *   The Preview window now correctly applies the user's assigned custom CSS.
    *   Fixed a bug where exporting a single, non-part story as a text file would fail.

### Known Issues

*   Logging out from any page other than the main application dashboard will incorrectly redirect back to the main app instead of the login screen.
*   The background flickering in the *Lore Codex* Overview is believed to be resolved, but please [open an issue](https://github.com/chatelainedev/creators-toolkit/issues) if you still encounter it.

## v2.1.0 - 11/13/2025

### What's New

#### App-Wide Changes
- **Terminology Update** - "Generate" buttons renamed to "Create" throughout the app for clarity
- **New UI Images** - Refreshed some visual assets across the interface
- **AI Tools Toggle** - CoWriter and Character/Lorebook Managers are now disabled by default; enable them in User Settings to access AI-powered features

#### Lore Codex Enhancements

**New Features:**
- **Character Info Display** - RPG-style stat display for character profiles. Enable globally in Characters category settings, then toggle per character. Displays curated information in a styled section with alternate styles available in Appearance tab
- **World Entry Icons** - Create and assign custom icons to Magic, Cultivation, and Items entries; icons display in Character Info Display
- **Section Renaming** - Rename World categories (Culture, Magic, Cultivation, Events) to match your project's terminology
- **Faction Organization** - Control the display order of Factions on the Characters page in generated HTML

**Fixes & Improvements:**
- Fixed Custom Pages including unnecessary CSS for horizontal link containers
- Refined Character Subcontainer styles in Appearance tab - reduced excess margins, enhanced Minimal Style, fixed Tab style layout

#### Lorebook Manager Improvements

**New Features:**
- **Find/Replace** - Search and replace text across lorebook entries
- **Advanced Options** - Additional configuration options for individual entries
- **Add Category Button** - Create categories via button in addition to Enter key
- **Copy Context Menu** - Right-click entries to quickly copy content

**Fixes & Improvements:**
- Resolved bugs affecting category functionality
- Improved exported plaintext format with standard markdown dividers

### Known Issues
- Overview backgrounds in Lore Codex may cause flickering
- HTML Preview functionality needs refinement for Lore Codex and RP Archiver
- Image hover alignment for World items requires adjustment
- Subheaders in Storylines page incorrectly showing with filters applied
- Save button styling in playlist modal needs correction

### Planned Features
- Bulk Edit functionality coming to Character Manager
- Additional category customization in Lore Codex
- File upload for roleplays in RP Archiver

### Upgrade Instructions
1. **VERY IMPORTANT**: Make a COPY of your `users/` folder before updating (all of your user data is in this folder, as long as you have this, your user data cannot be lost)
2. Download the v2.1.0 release and unzip, placing the new `creators-toolkit-2.1.0` folder wherever you'd like on your system
> **Note**: update.bat for previous versions (v1.0.0, v2.0.0) isn't working, you'll need to manually update!
3. Paste your `users/` folder in the new `creators-toolkit-2.1.0` folder
3. Run `start-server.bat` or `start-server.sh` 
4. All user data and projects will be preserved
5. If using AI features, remember to enable them in User Settings

> When toggling AI Tools in User Settings, it may say email is required. You can put whatever you like in the email field (eg email@email.com)--it's not actually used for anything, it isn't saved anywhere aside from your own system. I'll fix this in the next update, not sure why it's prompting for it -_-

---

**As always:** All your data stays on your computer. No internet required after initial setup. Report bugs via GitHub Issues.

## v2.0 - 10/2025

### What's New

#### Lore Codex Enhancements

**New Features:**
- **Magic Category** - Added to World items for organizing magical systems and supernatural elements
- **Storyline Organization** - Section headers and subheaders now supported with dedicated Options menu to toggle visibility
- **Faction Assignment** - Characters can be assigned to Factions (from World items) and automatically organized by Faction in generated HTML; toggle via new Character Options menu
- **Lorebook Integration** - Export button appears next to World header in generated HTML when a lorebook is linked to your project
- **Character Cards** - Attach character cards to Characters; right-click character images in generated HTML to download
- **Enhanced Tag System** - New tag syntax `tagname(#color1 #color2 #color3)` for custom tag colors, text colors, and hover effects

#### New Managers

**Character Manager:**
- Import or create character cards for popular AI roleplay platforms
- Add alternate fields and avatars to cards
- Organize cards into folders for better management
- Export in a variety of formats

**Lorebook Manager:**
- Import or create lorebooks for AI roleplay platforms
- Edit existing entries or create new ones
- Organize entries into collapsible categories
- Hide categories and export only visible entries
- Bulk edit multiple entries at once
- AI Helper for generating entry suggestions

#### App-Wide Improvements

- **User Management** - User selection dropdown added to login screen
- **Guest Access** - "Login as Guest" option for quick exploration without account creation
- **Enhanced Themes** - Additional color themes available
- **User ID Display** - Your User ID now visible in Settings for reference
- **Managers Access** - New Managers dropdown in main navigation for quick access to Character and Lorebook Managers

### Quality of Life Improvements

- **Project Renaming** - Projects and HTML files can now be renamed via right-click on project dropdown
- **CSS Refinements** - General styling improvements across all tools
- **Lorebook Isolation** - Fixed bug where lorebooks would incorrectly carry over between projects
- **Storyline Navigation** - Subarc event links now properly functional in generated HTML

### Notes

- Old project folders are not automatically deleted when renaming - manually delete or keep as backups
- For existing projects, you may need to re-link lorebooks after updating

### Known Issues

- None reported at this time

### Upgrade Instructions
(If you're upgrading from v1.0.0)
1. Backup your `users/` folder before updating
2. Two options for upgrading:
- Option 1: Manually update by downloading the newest release and pasting your `users/` folder in the new folder
- Option 2: (Windows only) Only download the `update.bat`, replace v1.0.0 update.bat with the new version, and run it
3. Run `start-server.bat` or `start-server.sh` as usual (or your Creator's Toolkit.lnk)
4. Your user data and projects will be preserved

**IMPORTANT**: If this is your first install, make sure to first install [Node](https://nodejs.org/en)

---

**As always:** All your data stays on your computer. No internet required after initial setup. Report bugs via GitHub Issues.

## v1.0 - Initial Release - 9/20/2025

### Quick Start

1. **Install Node.js** from https://nodejs.org/
2. **Extract** the project folder
3. **Run** `start-server.bat` (Windows) or `start-server.sh` (Mac/Linux)
4. **Wait** for setup (1-2 minutes first time)
5. **Open** http://localhost:3000 in your browser

See README.md for detailed instructions.

- File-based user accounts with password security
- Three integrated writing tools in one package
- Offline functionality - no internet required after setup
- Cross-platform support (Windows, Mac, Linux)
- Export to HTML and ZIP formats

### Known Issues

- Card transparency in Lore Codex Solos view - will adjust
- The update.bat doesn't work correctly - if you use this version, you must manually update.