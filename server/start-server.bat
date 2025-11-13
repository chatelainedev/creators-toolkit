@echo off
chcp 65001 >nul
echo Starting Creator's Toolkit Server...
echo.

REM Check if shortcut exists in parent directory, if not create it
if not exist "..\Creator's Toolkit.lnk" (
    echo Creating desktop shortcut in main folder...
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%~dp0..\Creator''s Toolkit.lnk'); $Shortcut.TargetPath = '%~f0'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = 'Launch Creator''s Toolkit - Lore Codex'; if (Test-Path '%~dp0icon.ico') { $Shortcut.IconLocation = '%~dp0icon.ico' }; $Shortcut.Save()"
    echo Shortcut created in main folder!
    echo.
)

REM Change to server directory
cd /d "%~dp0"

echo Installing/updating dependencies...
echo Installing core dependencies...
call npm install express fs-extra cors --silent
echo Installing file upload support...
call npm install multer --silent
echo Installing image processing support...
call npm install sharp --silent
echo Installing password security...
call npm install bcrypt --silent
echo Installing PNG metadata support...
call npm install png-chunk-text png-chunks-extract png-chunks-encode --silent
echo Installing ZIP archive support...
call npm install archiver --silent
echo Installing any remaining dependencies...
call npm install --silent
echo All dependencies installed!
echo.
echo Starting server...
echo This will automatically open your browser to: http://localhost:9000
echo Press Ctrl+C to stop the server
echo.

REM Start the server in the background and open browser
start /B npm start
timeout /t 3 /nobreak >nul
start http://localhost:9000

REM Keep the window open and wait for the background process
echo.
echo Server is running and browser opened!
echo You can now use the Creator's Toolkit with file-based user system!
echo.
echo Manual link: http://localhost:9000
echo User accounts: File-based (no more localStorage dependency)
echo Custom avatars: Supported (2MB max, jpg/png/gif/webp)
echo Lore Codex projects: users/username/sites/project-name/
echo Roleplay projects: users/username/roleplays/universe-name/
echo User settings: users/username/settings/
echo Guest mode: users/guest/
echo.
echo New Features:
echo   - File-based user accounts and avatars
echo   - Password security with bcrypt hashing
echo   - Data migration from browser localStorage
echo   - User-specific project folders
echo   - Persistent settings and preferences
echo.
echo Press any key to stop the server...
pause >nul

REM Kill the background npm process when user presses a key
taskkill /f /im node.exe 2>nul
echo Server stopped.