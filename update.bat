@echo off
chcp 65001 >nul
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
    pause
    exit /b 1
)

echo ✅ Git detected, checking for updates...
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ This folder is not a git repository
    echo.
    echo This might be a manual download. To enable updates:
    echo 1. Download the git version from GitHub instead
    echo 2. Or manually download updates and copy your 'users' folder
    echo.
    pause
    exit /b 1
)

REM Backup critical user data (just in case)
echo 🔄 Creating backup of user data...
if exist "users" (
    if not exist "backup" mkdir backup
    xcopy "users" "backup\users_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" /E /I /Y >nul 2>&1
    echo ✅ User data backed up to backup folder
)

echo.
echo 🔍 Fetching latest updates from GitHub...
git fetch origin

REM Check if updates are available
git status -uno | findstr "Your branch is behind" >nul
if errorlevel 1 (
    echo ✅ You're already on the latest version!
    echo.
    pause
    exit /b 0
)

echo.
echo 📦 Updates available! Applying updates...
echo.

REM Show what's going to be updated
echo Changes to be applied:
git log HEAD..origin/main --oneline
echo.

echo ⚠️  WARNING: This will update all application files
echo ⚠️  Your user data in the 'users' folder will be preserved
echo.
set /p confirm="Continue with update? (y/N): "
if /i not "%confirm%"=="y" (
    echo Update cancelled.
    pause
    exit /b 0
)

REM Apply the updates
echo.
echo 🚀 Applying updates...
git pull origin main

if errorlevel 1 (
    echo.
    echo ❌ Update failed! Your user data is safe.
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Resolve any merge conflicts manually
    echo 3. Contact support if problems persist
    echo.
    echo Your backup is available in the 'backup' folder
    pause
    exit /b 1
)

@echo off
chcp 65001 >nul
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
    pause
    exit /b 1
)

echo ✅ Git detected, checking for updates...
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ This folder is not a git repository
    echo.
    echo This might be a manual download. To enable updates:
    echo 1. Download the git version from GitHub instead
    echo 2. Or manually download updates and copy your 'users' folder
    echo.
    pause
    exit /b 1
)

REM Backup critical user data (just in case)
echo 🔄 Creating backup of user data...
if exist "users" (
    if not exist "backup" mkdir backup
    xcopy "users" "backup\users_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%" /E /I /Y >nul 2>&1
    echo ✅ User data backed up to backup folder
)

echo.
echo 🔍 Fetching latest updates from GitHub...
git fetch origin

REM Check if updates are available
git status -uno | findstr "Your branch is behind" >nul
if errorlevel 1 (
    echo ✅ You're already on the latest version!
    echo.
    pause
    exit /b 0
)

echo.
echo 📦 Updates available! Applying updates...
echo.

REM Show what's going to be updated
echo Changes to be applied:
git log HEAD..origin/main --oneline
echo.

echo ⚠️  WARNING: This will update all application files
echo ⚠️  Your user data in the 'users' folder will be preserved
echo.
set /p confirm="Continue with update? (y/N): "
if /i not "%confirm%"=="y" (
    echo Update cancelled.
    pause
    exit /b 0
)

REM Apply the updates
echo.
echo 🚀 Applying updates...
git pull origin main

if errorlevel 1 (
    echo.
    echo ❌ Update failed! Your user data is safe.
    echo.
    echo Common solutions:
    echo 1. Check your internet connection
    echo 2. Resolve any merge conflicts manually
    echo 3. Contact support if problems persist
    echo.
    echo Your backup is available in the 'backup' folder
    pause
    exit /b 1
)

echo.
echo 🔄 Installing/updating server dependencies...
cd server
call npm install --silent
cd ..

echo.
echo ✅ Update completed successfully!
echo ✅ Your user data has been preserved
echo ✅ Application is ready to use
echo.
echo 📋 Changelog summary:
git log --oneline -5
echo.
echo Press any key to start the server...
pause >nul

REM Start the server
cd server
call start-server.bat