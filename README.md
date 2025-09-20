# Creator's Toolkit v1.0

A comprehensive writing suite featuring Lore Codex (worldbuilding organizer), RP Archiver (roleplay project manager), and CoWriter (AI writing assistant).

## Quick Start

### Prerequisites

You need Node.js installed on your computer to run Creator's Toolkit.

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
   - Your browser will automatically open to `http://localhost:3000`

3. **Create Your Account**
   - Click "Register" to create your account
   - This creates your personal user folder and settings
   - OR, alternatively, click "Continue as Guest" to explore as a guest user

4. **Future Launches**
   - Use the `Creator's Toolkit` shortcut created in the main folder
   - Or run `start-server.bat`/`start-server.sh` again

## What's Included

### Lore Codex
- Organize characters, locations, cultures, religions, and more
- Multiple templates (Basic, Detailed, Fantasy, Sci-Fi, etc.)
- Auto-generates beautiful HTML websites from your data
- Custom styling and themes
- Project management with favorites and tags

### RP Archiver
- Create "universes" to organize roleplay projects
- Story management with chapters and scenes
- Character profiles and relationships
- Image galleries and media organization
- Export to clean HTML formats

### CoWriter
- AI-powered writing suggestions
- Custom prompts and templates
- Context-aware assistance
- Built-in notebook for ideas and snippets

## File Organization

After setup, you'll have this structure:

```
creators-toolkit/
├── server/                     # Server files (don't modify)
├── Creator's Toolkit.lnk       # Shortcut to launch
└── users/
    ├── guest/                  # Guest user data 
    ├── userID/                 # Your personal folder
    │   ├── sites/              # Lore Codex projects
    │   ├── roleplays/          # RP Archiver projects
    │   └── settings/           # Your preferences & avatar
    └── accounts.json           # User accounts 
```

## Troubleshooting

### "npm is not recognized" Error
- Node.js isn't installed or not in system PATH
- Download and install Node.js from https://nodejs.org/
- Restart your computer after installation

### Server Won't Start
- Make sure you're running from the `server` folder
- Check that port 3000 isn't being used by another program
- Try running as Administrator if on Windows

### Can't Access Projects
- Make sure the server is running (you should see it in your browser at localhost:3000)
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

## Features

### User Management
- File-based user accounts and avatars
- Password security with bcrypt hashing
- Data migration from browser localStorage
- User-specific project folders
- Persistent settings and preferences

### Supported File Types
- **Avatars:** JPG, PNG, GIF, WebP (2MB max)
- **Exports:** HTML, ZIP archives

### Project Organization
- **Lore Codex projects:** `users/userID/sites/project-name/`
- **Roleplay projects:** `users/userID/roleplays/universe-name/`
- **User settings:** `users/userID/settings/`
- **Guest mode:** `users/guest/`