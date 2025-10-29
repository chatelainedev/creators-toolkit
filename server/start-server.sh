#!/bin/bash

echo "Starting Creator's Toolkit Server..."
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Installing/updating dependencies..."
echo "Installing core dependencies..."
npm install express fs-extra cors --silent
echo "Installing file upload support..."
npm install multer --silent
echo "Installing image processing support..."
npm install sharp --silent
echo "Installing password security..."
npm install bcrypt --silent
echo "Installing PNG metadata support..."
npm install png-chunk-text png-chunks-extract png-chunks-encode --silent
echo "Installing ZIP archive support..."
npm install archiver --silent
echo "Installing any remaining dependencies..."
npm install --silent
echo "All dependencies installed!"
echo
echo "Starting server..."
echo "This will automatically open your browser to: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo

# Start the server in the background
npm start &
SERVER_PID=$!

# Wait a moment then open browser
sleep 3

# Try to open browser (different commands for different systems)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
elif command -v start > /dev/null; then
    start http://localhost:3000
else
    echo "Could not automatically open browser. Please navigate to: http://localhost:3000"
fi

echo
echo "Server is running and browser opened!"
echo "You can now use the Creator's Toolkit with file-based user system!"
echo
echo "Manual link: http://localhost:3000"
echo "User accounts: File-based (no more localStorage dependency)"
echo "Custom avatars: Supported (2MB max, jpg/png/gif/webp)"
echo "Lore Codex projects: users/username/sites/project-name/"
echo "Roleplay projects: users/username/roleplays/universe-name/"
echo "User settings: users/username/settings/"
echo "Guest mode: users/guest/"
echo
echo "New Features:"
echo "  - File-based user accounts and avatars"
echo "  - Password security with bcrypt hashing"
echo "  - Data migration from browser localStorage"
echo "  - User-specific project folders"
echo "  - Persistent settings and preferences"
echo
echo "Press any key to stop the server..."

# Wait for user input
read -n 1 -s

# Kill the server process
echo
echo "Stopping server..."
kill $SERVER_PID 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null || true
echo "Server stopped."