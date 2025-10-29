@echo off
chcp 65001 >nul
echo ========================================
echo     Creator's Toolkit - Update Check
echo ========================================
echo.

REM === CONFIGURATION ===
set GITHUB_USER=chatelainedev
set GITHUB_REPO=creators-toolkit
REM ====================

REM Get current version from package.json
for /f "tokens=2 delims=:, " %%a in ('findstr /C:"\"version\"" server\package.json') do (
    set CURRENT_VERSION=%%a
)
set CURRENT_VERSION=%CURRENT_VERSION:"=%
set CURRENT_VERSION=%CURRENT_VERSION: =%

echo Current version: %CURRENT_VERSION%
echo Checking for updates...
echo.

REM Check GitHub API for latest release
set API_URL=https://api.github.com/repos/%GITHUB_USER%/%GITHUB_REPO%/releases/latest
set TEMP_JSON=%TEMP%\release_info.json

powershell -Command "try { Invoke-WebRequest -Uri '%API_URL%' -OutFile '%TEMP_JSON%' -UseBasicParsing } catch { exit 1 }"

if errorlevel 1 (
    echo ❌ Could not connect to GitHub
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

REM Parse latest version and download URL from JSON using PowerShell
for /f "delims=" %%a in ('powershell -Command "(Get-Content '%TEMP_JSON%' | ConvertFrom-Json).tag_name"') do set LATEST_VERSION=%%a
for /f "delims=" %%a in ('powershell -Command "(Get-Content '%TEMP_JSON%' | ConvertFrom-Json).zipball_url"') do set DOWNLOAD_URL=%%a

REM Clean up version (remove 'v' prefix if present)
set LATEST_VERSION=%LATEST_VERSION:v=%
set LATEST_VERSION=%LATEST_VERSION: =%

echo Latest version: %LATEST_VERSION%
echo.

REM Compare versions (remove spaces and quotes for comparison)
if "%CURRENT_VERSION%"=="%LATEST_VERSION%" (
    echo ✅ You're already on the latest version!
    echo.
    pause
    exit /b 0
)

echo 🎉 New version available: %LATEST_VERSION%
echo.
echo This will:
echo   1. Download the new version
echo   2. Backup your user data and settings
echo   3. Install the update
echo   4. Restore your data
echo.
echo Your 'users' folder will be preserved (see .gitignore for details).
echo.
set /p CONFIRM="Update now? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo Update cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo     Downloading Update
echo ========================================
echo.

REM Create temp directory
set UPDATE_TEMP=%TEMP%\ct_update_%RANDOM%
if not exist "%UPDATE_TEMP%" mkdir "%UPDATE_TEMP%"

set ZIP_FILE=%UPDATE_TEMP%\update.zip

echo Downloading from GitHub...
powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%ZIP_FILE%' -UseBasicParsing"

if not exist "%ZIP_FILE%" (
    echo ❌ Download failed
    rmdir /s /q "%UPDATE_TEMP%"
    pause
    exit /b 1
)

echo ✅ Download complete
echo.

echo ========================================
echo     Installing Update
echo ========================================
echo.

echo Extracting files...
powershell -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%UPDATE_TEMP%' -Force"

if errorlevel 1 (
    echo ❌ Extraction failed
    rmdir /s /q "%UPDATE_TEMP%"
    pause
    exit /b 1
)

REM Find the extracted folder (GitHub zips create a folder with repo name and commit hash)
for /d %%a in ("%UPDATE_TEMP%\*") do set EXTRACTED_FOLDER=%%a

echo Extracted to: %EXTRACTED_FOLDER%
echo.

REM Verify extraction worked
if not exist "%EXTRACTED_FOLDER%" (
    echo ❌ Could not find extracted files
    rmdir /s /q "%UPDATE_TEMP%"
    pause
    exit /b 1
)

echo Backing up user data (as specified in .gitignore)...
set BACKUP_FOLDER=%UPDATE_TEMP%\user_backup

REM Backup users folder (main user data)
if exist "users" (
    echo   - Backing up users folder...
    xcopy "users" "%BACKUP_FOLDER%\users" /E /I /Y >nul
)

REM Backup guest folder if it exists
if exist "guest" (
    echo   - Backing up guest folder...
    xcopy "guest" "%BACKUP_FOLDER%\guest" /E /I /Y >nul
)

REM Backup node_modules to save reinstall time
if exist "server\node_modules" (
    echo   - Backing up node_modules...
    xcopy "server\node_modules" "%BACKUP_FOLDER%\node_modules" /E /I /Y >nul
)

REM Backup the shortcut if it exists
if exist "Creator's Toolkit.lnk" (
    echo   - Backing up shortcut...
    copy "Creator's Toolkit.lnk" "%BACKUP_FOLDER%\Creator's Toolkit.lnk" >nul
)

REM Backup any .env files if they exist
if exist ".env" (
    echo   - Backing up .env file...
    copy ".env" "%BACKUP_FOLDER%\.env" >nul
)

echo ✅ Backup complete
echo.

echo Installing new files...
REM Copy ALL new files, then restore backups on top
xcopy "%EXTRACTED_FOLDER%\*" "%cd%" /E /I /Y /H

if errorlevel 1 (
    echo ❌ Failed to copy new files!
    echo Attempting to restore from backup...
    if exist "%BACKUP_FOLDER%\users" xcopy "%BACKUP_FOLDER%\users\*" "users" /E /I /Y >nul
    if exist "%BACKUP_FOLDER%\guest" xcopy "%BACKUP_FOLDER%\guest\*" "guest" /E /I /Y >nul
    if exist "%BACKUP_FOLDER%\.env" copy "%BACKUP_FOLDER%\.env" ".env" >nul
    echo.
    echo Update failed but your data has been restored.
    pause
    exit /b 1
)

echo ✅ New files installed
echo.

echo Restoring preserved data...
REM Restore users folder
if exist "%BACKUP_FOLDER%\users" (
    echo   - Restoring users folder...
    xcopy "%BACKUP_FOLDER%\users\*" "users" /E /I /Y >nul
)

REM Restore guest folder
if exist "%BACKUP_FOLDER%\guest" (
    echo   - Restoring guest folder...
    xcopy "%BACKUP_FOLDER%\guest\*" "guest" /E /I /Y >nul
)

REM Restore node_modules
if exist "%BACKUP_FOLDER%\node_modules" (
    echo   - Restoring node_modules...
    xcopy "%BACKUP_FOLDER%\node_modules\*" "server\node_modules" /E /I /Y >nul
)

REM Restore the shortcut
if exist "%BACKUP_FOLDER%\Creator's Toolkit.lnk" (
    echo   - Restoring shortcut...
    copy "%BACKUP_FOLDER%\Creator's Toolkit.lnk" "Creator's Toolkit.lnk" >nul
)

REM Restore .env file
if exist "%BACKUP_FOLDER%\.env" (
    echo   - Restoring .env file...
    copy "%BACKUP_FOLDER%\.env" ".env" >nul
)

echo ✅ Data restored
echo.

echo ========================================
echo     Finalizing
echo ========================================
echo.

echo Checking/updating dependencies...
cd server
call npm install --silent
cd ..

echo Cleaning up temporary files...
del "%TEMP_JSON%" >nul 2>&1
rmdir /s /q "%UPDATE_TEMP%" >nul 2>&1

echo.
echo ========================================
echo ✅ Update Complete!
echo ========================================
echo.
echo Updated from %CURRENT_VERSION% to %LATEST_VERSION%
echo.
echo What's new in %LATEST_VERSION%:
echo Check the changelog at:
echo https://github.com/%GITHUB_USER%/%GITHUB_REPO%/releases/tag/v%LATEST_VERSION%
echo.
echo Your user data has been preserved.
echo.
echo Starting the server in 3 seconds...
timeout /t 3 /nobreak >nul

REM Start the server and browser
cd server
echo.
echo Server is starting...
echo Browser will open automatically at http://localhost:3000
echo.
start /B npm start
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ✅ Server started! 
echo You can close this window - the server is running in the background.
echo To stop the server, run stop-server.bat or close the main server window.
echo.
pause