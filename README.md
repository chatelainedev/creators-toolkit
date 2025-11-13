# Creator's Toolkit v2.1.0

A comprehensive writing suite for writers, roleplayers, and creatives of all types. 

This is a personal project that was created for my own use. It's far from perfect, but I'm always tweaking and improving it! If you have any comments, suggestions, or issues, you can let me know by [e-mailing me](mailto:chatelainedev@gmail.com).

[Creator's Toolkit Wiki](https://github.com/chatelainedev/creators-toolkit/wiki)

[![ct-main.png](https://i.postimg.cc/vmZdmvfd/ct-main.png)](https://postimg.cc/tswcSWBr)

## Quick Start

### Prerequisites

> [!WARNING]
> You need Node.js installed on your computer to run Creator's Toolkit.

**Download Node.js:** https://nodejs.org/
- Choose the "LTS" (recommended) version
- Install with default settings
- Restart your computer after installation

### Installation

1. **Download Creator's Toolkit**
   - Extract the `creators-toolkit` folder to wherever you want it (Desktop, Documents, etc.)

2. **First Launch**
   - Navigate to the `creators-toolkit/server/` folder
   - Double-click `start-server.bat` (Windows) or `start-server.sh` (Mac/Linux)
   - Wait for automatic setup (this may take 1-2 minutes the first time)
   - Your browser will automatically open to `http://localhost:9000`

3. **Create Your Account**
   - Click "Register" to create your account
   - This creates your personal user folder and settings
   - OR, alternatively, click "Continue as Guest" to explore as a guest user

4. **Future Launches**
   - Use the `Creator's Toolkit` shortcut created in the main folder
   - Or run `start-server.bat`/`start-server.sh` again

## What's Included

### Lore Codex
[![characters-example.png](https://i.postimg.cc/vmZdmvfH/characters-example.png)](https://postimg.cc/cv2z9wFV)
[![lc-main.png](https://i.postimg.cc/L8GbzcX5/lc-main.png)](https://postimg.cc/bZHgPF1f)
- Organize characters, locations, factions, items, and more
- Multiple templates (Basic, Detailed, Fantasy, Sci-Fi, etc.)
- Creates HTML websites from your data
- Custom styling and themes
- Project management with favorites and tags

### RP Archiver
[![rpa-main.png](https://i.postimg.cc/sg0RbHgH/rpa-main.png)](https://postimg.cc/yD95ZP90)
- Create "universes" to organize roleplay projects
- Story management with chapters and scenes
- Character profiles and relationships
- Image galleries and media organization
- Export to clean HTML formats

### Notebook
[![nt-example.png](https://i.postimg.cc/9fjDwfGC/nt-example.png)](https://postimg.cc/212kPrcK)
- Built-in notebook for ideas and snippets
- Markdown theme options
- Write and view as markdown
- Save multiple notebooks for different note collections

> [!NOTE]
> The AI-enabled tools below are completely optional and disabled by default.

### CoWriter
[![cw-styles.png](https://i.postimg.cc/2jPG9QYH/cw-styles.png)](https://postimg.cc/DmP18b8s)
[![cw-example.png](https://i.postimg.cc/mZ0jpY4q/cw-example.png)](https://postimg.cc/Lh3jnZnB)
- AI-powered writing suggestions
- Custom prompts and templates
- Context-aware assistance
- Create Snippets to use with Notebook

> [!IMPORTANT] 
> CoWriter is disabled by default; to enable, select the AI Tools Enabled checkbox in Settings (accessed by clicking on user avatar)

### Managers
#### Character Manager
[![cm-charaedit.png](https://i.postimg.cc/2yLx73Lb/cm-charaedit.png)](https://postimg.cc/jnKNsxXt)
[![cm-chara.png](https://i.postimg.cc/BbPCBtP8/cm-chara.png)](https://postimg.cc/JHmJ1rqm)
- Import or create character cards for popular AI roleplay platforms
- Add alternate fields or alternate avatars
- Card Management: organize cards into folders
- Export in a variety of formats

> [!IMPORTANT]
> Character Manager is disabled by default; to enable, select the AI Tools Enabled checkbox in Settings (accessed by clicking on user avatar)

#### Lorebook Manager
[![lm-main.png](https://i.postimg.cc/DwFqtFzp/lm-main.png)](https://postimg.cc/ppGhFwzK)
- Import or create lorebooks for popular AI roleplay platforms
- Edit existing entries or create new ones
- Organize entries into categories that can be hidden, only export visible entries
- Bulk Edit entries
- AI Helper for entry suggestions

> [!IMPORTANT]
> Lorebook Manager is disabled by default; to enable, select the AI Tools Enabled checkbox in Settings (accessed by clicking on user avatar)

## File Organization

After setup, you'll have this structure:

```
creators-toolkit/
├── server/                     # Server files (don't modify)
├── Creator's Toolkit.lnk       # Shortcut to launch
└── users/
    ├── guest/                  # Guest user data 
    ├── userID/                 # Your personal folder
    │   ├── backups/            # File backups
    │   ├── cowriter/           # CoWriter saves/settings     
    │   ├── notebooks/          # Notebook notes/settings
    │   ├── sites/              # Lore Codex projects
    │   ├── roleplays/          # RP Archiver projects
    │   └── settings/           # Your preferences & avatar, Character Manager and Lorebook Manager saves
    └── accounts.json           # User accounts 
```

## Troubleshooting

### "Site can't be reached" Error in browser
- Node.js isn't installed or not in system PATH
- Download and install Node.js from https://nodejs.org/
- Restart your computer after installation

### "npm is not recognized" Error
- Node.js isn't installed or not in system PATH
- Download and install Node.js from https://nodejs.org/
- Restart your computer after installation

### Server Won't Start
- Make sure you're running from the `server` folder
- Check that port 9000 isn't being used by another program
- Try running as Administrator if on Windows

### Can't Access Projects
- Make sure the server is running (you should see it in your browser at localhost:9000)
- Check that your user folder exists in `users/userID/`
- Try refreshing the browser page

### Lost Data
- Check the `users/userID/` folder for your projects
- Look for `.backup.json` files in your settings folder

### Batch/Shell Script Issues
- If you downloaded from GitHub and get script errors, the line endings may be corrupted
- Delete and recreate the script files with proper line endings
- For Windows: Use CRLF line endings
- For Mac/Linux: Use LF line endings

## Privacy & Security

- All data stays on your computer - nothing is sent to external servers
- No internet required after initial Node.js setup
- Your projects remain private unless you choose to export/share them
- User passwords are securely hashed with bcrypt
- File-based storage means no dependency on browser localStorage