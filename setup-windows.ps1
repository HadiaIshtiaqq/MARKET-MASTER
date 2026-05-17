# MarketMaster AI - Windows Setup Script
# Run this script in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MarketMaster AI - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    $host.ui.WriteErrorLine("✗ Node.js is not installed!")
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version (18.x or higher)" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    $host.ui.WriteErrorLine("✗ npm is not installed!")
    Write-Host "npm should come with Node.js. Please reinstall Node.js." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    $host.ui.WriteErrorLine("✗ Frontend dependency installation failed!")
    exit 1
}
Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green

Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    $host.ui.WriteErrorLine("✗ Backend dependency installation failed!")
    Set-Location ..
    exit 1
}
Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting up Environment Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Copy .env.example to .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "⚠ Please edit .env and add your API keys" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

if (-not (Test-Path "server\.env")) {
    Write-Host "Creating server/.env file from server/.env.example..." -ForegroundColor Yellow
    Copy-Item "server\.env.example" "server\.env"
    Write-Host "✓ server/.env file created" -ForegroundColor Green
    Write-Host "⚠ Please edit server/.env and add your API keys" -ForegroundColor Yellow
} else {
    Write-Host "✓ server/.env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env and server\.env files with your API keys" -ForegroundColor White
Write-Host "2. Install PostgreSQL and Redis (or use Docker)" -ForegroundColor White
Write-Host "3. Run the database schema: psql -d marketmaster_ai -f database\schema.sql" -ForegroundColor White
Write-Host "4. Start the development servers:" -ForegroundColor White
Write-Host "   - Frontend: npm run dev" -ForegroundColor Cyan
Write-Host "   - Backend: cd server; npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or use Docker Compose:" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "   n8n Workflows: http://localhost:5678" -ForegroundColor Cyan
Write-Host ""

# Made with Bob
