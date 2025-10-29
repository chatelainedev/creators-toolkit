@echo off
chcp 65001 >nul
echo ========================================
echo     Creator's Toolkit - Update Check
echo ========================================
echo.

REM Check if git is available
echo Checking for git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo Git is not installed or not in PATH
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
echo Git detected successfully!

echo.
echo Checking if this is a git repository...
if not exist ".git" (
    echo This folder is not a git repository
    echo.
    echo This might be a manual download. To enable updates:
    echo 1. Download the git version from GitHub instead
    echo 2. Or manually download updates and copy your 'users' folder
    echo.
    pause
    exit /b 1
)
echo Git repository confirmed!

REM Backup critical user data (just in case)
echo.
echo Creating backup of user data...
if exist "users" (
    if not exist "backup" mkdir backup
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list 2^>nul') do if not "%%I"=="" set datetime=%%I
    set backup_name=users_%datetime:~0,8%_%datetime:~8,6%
    xcopy "users" "backup\%backup_name%" /E /I /Y >nul 2>&1
    echo User data backed up to backup\%backup_name%
)

echo.
echo Fetching latest updates from GitHub...
git fetch origin
echo Fetch completed!

REM Check if updates are available
echo.
echo Checking if updates are needed...
git status -uno | findstr "Your branch is behind" >nul
if errorlevel 1 (
    echo You're already on the latest version!
    echo.
    pause
    exit /b 0
)

echo.
echo Updates available! Preparing to apply updates...
echo.

REM Show what's going to be updated
echo Changes to be applied:
git log HEAD..origin/main --oneline
echo.

echo WARNING: This will update all application files
echo WARNING: Your user data in the 'users' folder will be preserved
echo.
set /p confirm="Continue with update? (y/N): "
if /i not "%confirm%"=="y" (
    echo Update cancelled.
    pause
    exit /b 0
)

REM Apply the updates
echo.
echo Applying updates...
git pull origin main

if errorlevel 1 (
    echo.
    echo Update failed! Your user data is safe.
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
echo Installing/updating server dependencies...
cd server
call npm install --silent
cd ..

echo.
echo Update completed successfully!
echo Your user data has been preserved
echo Application is ready to use
echo.
echo Recent changes:
git log --oneline -5
echo.
echo Press any key to start the server...
pause >nul

REM Start the server
cd server
call start-server.bat