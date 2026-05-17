# 🪟 MarketMaster AI - Windows Setup Guide

Complete step-by-step guide for setting up MarketMaster AI on Windows.

---

## 📋 Prerequisites

### 1. Install Node.js

1. Download Node.js LTS (18.x or higher) from: https://nodejs.org/
2. Run the installer
3. **Important:** Check "Automatically install necessary tools" during installation
4. Restart your computer after installation

**Verify Installation:**
```powershell
node --version
npm --version
```

### 2. Install Git (Optional but Recommended)

Download from: https://git-scm.com/download/win

### 3. Install PostgreSQL (Option 1: Local Installation)

1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and remember your password
3. Default port: 5432

**Verify Installation:**
```powershell
psql --version
```

### 4. Install Redis (Option 1: Local Installation)

**Using WSL2 (Recommended):**
```powershell
# Enable WSL2
wsl --install

# After restart, install Redis in WSL
wsl
sudo apt update
sudo apt install redis-server
redis-server --version
```

**Alternative: Use Docker Desktop**
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Redis will run in Docker container

---

## 🚀 Quick Setup (Easiest Method)

### Step 1: Install Dependencies

**Double-click:** `install-dependencies.bat`

Or run in PowerShell:
```powershell
.\install-dependencies.bat
```

This will:
- Check Node.js installation
- Install frontend dependencies
- Install backend dependencies

### Step 2: Configure Environment

1. **Copy environment files:**
   ```powershell
   Copy-Item .env.example .env
   Copy-Item server\.env.example server\.env
   ```

2. **Edit `.env` file:**
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Edit `server\.env` file:**
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=postgresql://marketmaster:password@localhost:5432/marketmaster_ai
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   JWT_SECRET=your_random_secret_key_here
   ```

### Step 3: Set Up Database

**Option A: Using Docker (Easiest)**
```powershell
docker-compose up -d postgres redis
```

**Option B: Local PostgreSQL**
```powershell
# Create database
psql -U postgres
CREATE DATABASE marketmaster_ai;
CREATE USER marketmaster WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marketmaster_ai TO marketmaster;
\q

# Run schema
psql -U marketmaster -d marketmaster_ai -f database\schema.sql
```

### Step 4: Start Development Servers

**Double-click:** `start-dev.bat`

Or run in PowerShell:
```powershell
.\start-dev.bat
```

This will open two command windows:
- Frontend server (http://localhost:3000)
- Backend server (http://localhost:3001)

---

## 🐳 Docker Setup (Recommended for Production)

### Prerequisites
- Docker Desktop for Windows installed and running

### Start All Services

```powershell
# Start all services (PostgreSQL, Redis, Backend, Frontend, n8n)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Access Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **n8n Workflows:** http://localhost:5678
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

---

## 🔧 Manual Setup (Advanced)

### 1. Install Frontend Dependencies

```powershell
npm install
```

### 2. Install Backend Dependencies

```powershell
cd server
npm install
cd ..
```

### 3. Start Frontend (Terminal 1)

```powershell
npm run dev
```

### 4. Start Backend (Terminal 2)

```powershell
cd server
npm run dev
```

---

## 🔑 Getting API Keys

### Google Gemini AI API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add to `.env` and `server\.env`

### Social Media API Keys

#### Instagram/Facebook
1. Go to: https://developers.facebook.com/
2. Create an app
3. Add Instagram Graph API product
4. Get App ID and App Secret

#### Twitter/X
1. Go to: https://developer.twitter.com/
2. Create a project and app
3. Generate API keys and tokens

#### LinkedIn
1. Go to: https://www.linkedin.com/developers/
2. Create an app
3. Get Client ID and Client Secret

---

## 🐛 Troubleshooting

### Issue: "npm is not recognized"

**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. Make sure to check "Add to PATH" during installation
3. Restart your computer
4. Open a new PowerShell window

### Issue: "Cannot run scripts"

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "Port 3000 or 3001 already in use"

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: "Database connection failed"

**Solution:**
1. Make sure PostgreSQL is running:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name postgresql*
   
   # Start if not running
   Start-Service postgresql-x64-14
   ```

2. Verify connection string in `server\.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/marketmaster_ai
   ```

### Issue: "Redis connection failed"

**Solution:**

**If using WSL:**
```powershell
wsl
sudo service redis-server start
redis-cli ping
# Should return: PONG
```

**If using Docker:**
```powershell
docker-compose up -d redis
```

### Issue: TypeScript errors in VS Code

**Solution:**
1. Open VS Code
2. Press `Ctrl+Shift+P`
3. Type: "TypeScript: Restart TS Server"
4. Press Enter

---

## 📦 Project Structure

```
MarketMasterAI/
├── install-dependencies.bat    # Install all dependencies
├── start-dev.bat               # Start development servers
├── setup-windows.ps1           # PowerShell setup script
├── docker-compose.yml          # Docker configuration
├── .env                        # Frontend environment variables
├── package.json                # Frontend dependencies
├── src/                        # Frontend source code
├── server/
│   ├── .env                    # Backend environment variables
│   ├── package.json            # Backend dependencies
│   └── src/                    # Backend source code
├── database/
│   └── schema.sql              # Database schema
└── n8n-workflows/              # Automation workflows
```

---

## 🎯 Next Steps After Setup

1. **Test the Installation:**
   - Open http://localhost:3000
   - You should see the MarketMaster AI interface

2. **Register a Vendor Account:**
   - Click "Register" or use API: `POST /api/auth/register`

3. **Connect Social Media Accounts:**
   - Navigate to Settings > Social Media
   - Connect your Instagram, Facebook, etc.

4. **Upload Your First Product:**
   - Use AI Tag Scan to upload product images
   - Or use IBM Bob to scan delivery challans

5. **Generate Content:**
   - Select a product
   - Click "Generate Post"
   - Review and approve the AI-generated content

6. **Schedule Posts:**
   - Choose platforms and times
   - Enable auto-posting or human approval

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review logs in `server/logs/`
3. Check GitHub Issues: https://github.com/your-org/marketmaster-ai/issues
4. Contact support: support@marketmaster.ai

---

## 🔄 Updating the Application

```powershell
# Pull latest changes (if using Git)
git pull

# Update dependencies
.\install-dependencies.bat

# Restart servers
.\start-dev.bat
```

---

## 🛑 Stopping the Application

### If using batch files:
- Close the command windows that opened

### If using Docker:
```powershell
docker-compose down
```

### If running manually:
- Press `Ctrl+C` in each terminal window

---

**Happy Building! 🚀**