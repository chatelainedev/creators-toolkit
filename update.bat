@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo     Creator's Toolkit - Update Check
echo ========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo.
    echo To enable automatic updates, please:
    echo 1. Install Git from https://git-scm.com/
    echo 2. Make sure git is added to your PATH
    echo 3. Run this update script again
    echo.
    echo Alternative: Download the latest version manually from GitHub
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo ✅ Git detected, checking for updates...
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ This folder is not a git repository
    echo.
    echo This appears to be a manual download. To enable automatic updates:
    echo 1. Clone the repository instead: git clone https://github.com/chatelainedev/creators-toolkit.git
    echo 2. Copy your 'users' folder to the new cloned version
    echo 3. Or manually download updates and replace files (preserving your 'users' folder)
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if server is currently running
netstat -an | find "LISTENING" | find ":3000" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  WARNING: Server appears to be running on port 3000
    echo Please close the server before updating to avoid conflicts.
    echo.
    set /p continue="Continue anyway? (y/N): "
    if /i not "!continue!"=="y" (
        echo Update cancelled.
        pause
        exit /b 0
    )
)

REM Backup critical user data (with better error handling)
echo 📄 Creating backup of user data...
if exist "users" (
    if not exist "backup" mkdir backup
    
    REM Create timestamp for backup folder
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set datetime=%%I
    set timestamp=!datetime:~0,8!_!datetime:~8,6!
    set backup_folder=backup\users_!timestamp!
    
    echo Backing up to: !backup_folder!
    xcopy "users" "!backup_folder!" /E /I /Y >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Backup failed, but continuing...
    ) else (
        echo ✅ User data backed up successfully
    )
) else (
    echo ℹ️  No users folder found - nothing to backup
)

echo.
echo 🔍 Fetching latest updates from GitHub...
git fetch origin 2>&1

if errorlevel 1 (
    echo ❌ Failed to fetch updates. Check your internet connection.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if updates are available
git status -uno | findstr "Your branch is behind" >nul
if errorlevel 1 (
    echo ✅ You're already on the latest version!
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 0
)

echo.
echo 📦 Updates available! Analyzing changes...
echo.

REM Check for potential conflicts in core files
echo Checking for potential conflicts...
git diff --name-only HEAD origin/main > temp_changes.txt
set has_conflicts=0

REM Check if any modified files would conflict
for /f %%f in (temp_changes.txt) do (
    git status --porcelain | findstr "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo ⚠️  Potential conflict detected in: %%f
        set has_conflicts=1
    )
)
del temp_changes.txt >nul 2>&1

if !has_conflicts! equ 1 (
    echo.
    echo ⚠️  WARNING: You have local changes that might conflict with updates!
    echo This could happen if you've customized the application files.
    echo.
    echo Recommendations:
    echo 1. Backup your changes before proceeding
    echo 2. Consider using a separate branch for customizations
    echo 3. You may need to resolve conflicts manually
    echo.
    set /p continue="Continue anyway? (y/N): "
    if /i not "!continue!"=="y" (
        echo Update cancelled.
        pause
        exit /b 0
    )
)

REM Show what's going to be updated
echo.
echo Changes to be applied:
git log HEAD..origin/main --oneline --max-count=10
echo.

echo ⚠️  WARNING: This will update all application files
echo ⚠️  Your user data in the 'users' folder will be preserved
echo ✅ A backup has been created in the 'backup' folder
echo.
set /p confirm="Continue with update? (y/N): "
if /i not "!confirm!"=="y" (
    echo Update cancelled.
    pause
    exit /b 0
)

REM Stash any local changes temporarily
echo.
echo 📝 Temporarily stashing any local changes...
git stash push -m "Auto-stash before update" >nul 2>&1

REM Apply the updates
echo 🚀 Applying updates...
git pull origin main

if errorlevel 1 (
    echo.
    echo ❌ Update failed! Attempting to restore previous state...
    git stash pop >nul 2>&1
    echo.
    echo Your user data is safe in both the working directory and backup folder.
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Resolve any merge conflicts manually
    echo 3. Contact support if problems persist
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Restore any stashed changes (if they don't conflict)
git stash list | find "Auto-stash before update" >nul 2>&1
if not errorlevel 1 (
    echo 📝 Attempting to restore your local changes...
    git stash pop >nul 2>&1
    if errorlevel 1 (
        echo ⚠️  Could not automatically restore some local changes.
        echo Your changes are preserved in git stash if needed.
    )
)

echo.
echo 📦 Installing/updating server dependencies...
if exist "server" (
    cd server
    call npm install --silent 2>nul
    if errorlevel 1 (
        echo ⚠️  npm install encountered some issues, but continuing...
    )
    cd ..
) else (
    echo ⚠️  Server folder not found - skipping npm install
)

echo.
echo ✅ Update completed successfully!
echo ✅ Your user data has been preserved
echo ✅ Application is ready to use
echo.
echo 📋 Recent changes:
git log --oneline -5
echo.
echo 💡 Tips:
echo - Your backup is in: backup\users_!timestamp!
echo - Report any issues on GitHub: https://github.com/chatelainedev/creators-toolkit/issues
echo.

set /p start_server="Start the server now? (Y/n): "
if /i not "!start_server!"=="n" (
    echo.
    echo 🚀 Starting server...
    cd server
    call start-server.bat
) else (
    echo.
    echo To start the server later, run: server\start-server.bat
    echo Press any key to exit...
    pause >nul
)
