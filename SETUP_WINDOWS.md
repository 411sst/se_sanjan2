# Couponify - Windows Setup Guide

## Quick Start for Windows

This guide provides all the commands you need to run on Windows Command Prompt (cmd).

---

## Prerequisites Installation

1. **Install Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Run installer and follow instructions
   - Verify: Open cmd and run `node --version`

2. **Install Git**
   - Download: https://git-scm.com/download/win
   - Run installer with default options
   - Verify: Open cmd and run `git --version`

3. **Install Docker Desktop** (Optional - for Redis)
   - Download: https://www.docker.com/products/docker-desktop/
   - Run installer and restart computer
   - Verify: Open cmd and run `docker --version`

---

## Step-by-Step Setup Commands

### 1. Clone the Project

Open Command Prompt and navigate to where you want the project:

```cmd
cd C:\Users\YourUsername\Documents
git clone <your-repository-url>
cd se_sanjan2
```

### 2. Install Root Dependencies

```cmd
npm install
```

### 3. Setup Backend

```cmd
cd backend
npm install
copy .env.example .env
npm run build
cd ..
```

### 4. Configure Backend Environment

Edit `backend\.env` file (use Notepad):

```cmd
notepad backend\.env
```

Minimum configuration needed:
```env
NODE_ENV=development
PORT=5000
DB_PATH=./database/couponify.db
JWT_SECRET=change-this-to-a-long-random-secret-key-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

Save and close the file.

### 5. Setup Frontend

```cmd
cd frontend
npm install
cd ..
```

### 6. Start Redis (Optional)

If you have Docker Desktop installed:

```cmd
docker-compose up -d redis
```

If you don't have Docker, skip this step. The app will work without Redis.

### 7. Run the Application

**Option A: Run both frontend and backend together (Recommended)**

```cmd
npm run dev
```

**Option B: Run separately in different terminals**

Terminal 1 (Backend):
```cmd
cd backend
npm run dev
```

Terminal 2 (Frontend):
```cmd
cd frontend
npm start
```

---

## Access the Application

- **Frontend**: Open browser to http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## Common Windows Commands

### Check if ports are in use

```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Kill process using a port

```cmd
REM Replace <PID> with the actual process ID from netstat output
taskkill /PID <PID> /F
```

### Clear and reinstall dependencies

```cmd
REM For backend
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

REM For frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### View logs

Backend logs are in: `backend\logs\`

```cmd
REM View latest log
type backend\logs\combined.log
```

### Stop all services

Press `Ctrl + C` in each terminal window running the servers.

To stop Docker containers:
```cmd
docker-compose down
```

---

## Testing Commands

```cmd
REM Run all tests
npm test

REM Run only backend tests
cd backend
npm test

REM Run only frontend tests
cd frontend
npm test

REM Run tests with coverage
npm run test:coverage
```

---

## Building for Production

```cmd
REM Build backend
cd backend
npm run build

REM Build frontend
cd frontend
npm run build
```

---

## Troubleshooting

### Error: "npm is not recognized"

Solution: Reinstall Node.js and make sure to check "Add to PATH" during installation.

### Error: "Port already in use"

Solution:
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "Module not found"

Solution:
```cmd
cd backend
rmdir /s /q node_modules
npm install
```

### Database locked error

Solution: Close all apps accessing the database and restart:
```cmd
cd backend
npm run dev
```

### Cannot start Docker

Solution: Make sure Docker Desktop is running. Check system tray for Docker icon.

---

## Complete Command Reference

### First Time Setup (Copy and paste these commands one by one)

```cmd
REM 1. Navigate to your projects folder
cd C:\Users\YourUsername\Documents

REM 2. Clone repository
git clone <repository-url>
cd se_sanjan2

REM 3. Install root dependencies
npm install

REM 4. Setup backend
cd backend
npm install
copy .env.example .env
npm run build
cd ..

REM 5. Setup frontend
cd frontend
npm install
cd ..

REM 6. Start Docker (optional)
docker-compose up -d

REM 7. Run the application
npm run dev
```

### Daily Development (After first setup)

```cmd
REM Navigate to project
cd C:\Users\YourUsername\Documents\se_sanjan2

REM Start everything
npm run dev

REM Or start Docker first if using Redis
docker-compose up -d
npm run dev
```

---

## Project Structure Quick Reference

```
se_sanjan2/
├── backend/              # Node.js backend
│   ├── src/             # Source code
│   ├── database/        # SQLite database (auto-created)
│   ├── logs/            # Application logs
│   └── .env             # Configuration (create this)
├── frontend/            # React frontend
│   ├── src/            # Source code
│   └── public/         # Static files
├── package.json        # Root dependencies
└── README.md          # Full documentation
```

---

## Environment Variables Explanation

Required in `backend\.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Backend server port | 5000 |
| DB_PATH | SQLite database location | ./database/couponify.db |
| JWT_SECRET | Secret key for JWT tokens | your-secret-key-min-32-chars |
| CORS_ORIGIN | Frontend URL for CORS | http://localhost:3000 |

---

## Next Steps After Setup

1. Verify backend is running:
   - Open: http://localhost:5000/health
   - Should see: `{"status":"ok",...}`

2. Verify frontend is running:
   - Open: http://localhost:3000
   - Should see: Couponify homepage

3. Check database was created:
   - Look for: `backend\database\couponify.db`

4. Start developing:
   - Refer to main README.md for API documentation
   - Check PRD for feature requirements

---

## Quick Commands Cheat Sheet

| Task | Command |
|------|---------|
| Run everything | `npm run dev` |
| Run backend only | `cd backend && npm run dev` |
| Run frontend only | `cd frontend && npm start` |
| Run tests | `npm test` |
| Build backend | `cd backend && npm run build` |
| Build frontend | `cd frontend && npm run build` |
| Start Docker | `docker-compose up -d` |
| Stop Docker | `docker-compose down` |
| Check health | Visit http://localhost:5000/health |
| View frontend | Visit http://localhost:3000 |

---

## Support

For detailed documentation, see: **README.md**

For issues, contact:
- Faculty Supervisor: @sheela824
- Teaching Assistants: @Omicarr, @PES2UG22CS175, @PES2UG22CS190, @Accuracy-exe

---

**Last Updated**: November 16, 2025
