@echo off
echo ========================================
echo   BrandPulse AI - Starting Development Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo Starting Backend Server...
start "BrandPulse Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "BrandPulse Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:3001
echo.
echo Press any key to close this window (servers will keep running)
pause >nul

@REM Made with Bob
