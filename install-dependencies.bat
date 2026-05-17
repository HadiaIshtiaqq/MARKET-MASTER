@echo off
echo ========================================
echo   MarketMaster AI - Installing Dependencies
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version (18.x or higher)
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo npm version:
npm --version
echo.

echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend dependency installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env and add your API keys
echo 2. Copy server\.env.example to server\.env and configure
echo 3. Set up PostgreSQL database
echo 4. Run: start-dev.bat to start the servers
echo.
pause

@REM Made with Bob
