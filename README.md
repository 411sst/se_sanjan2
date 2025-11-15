# Couponify - Virtual Coupon Distribution System

**Version:** 1.0
**Project ID:** P44
**Course:** UE23CS341A - Software Engineering & Project Management

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Technology Stack](#technology-stack)
4. [Windows Installation Guide](#windows-installation-guide)
5. [Project Structure](#project-structure)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Couponify is a comprehensive virtual coupon distribution platform that connects merchants with customers through a secure, efficient, and user-friendly digital coupon ecosystem.

### Key Features

- **Merchant Portal**: Create and manage coupon campaigns with real-time analytics
- **Customer Platform**: Browse, claim, and redeem coupons with wallet management
- **Secure Backend**: SQLite database, JWT authentication, RBAC, fraud prevention
- **Real-time Notifications**: Multi-channel notification system
- **QR Code + OTP**: Dual-factor redemption verification

---

## Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open Command Prompt and run:
     ```cmd
     node --version
     npm --version
     ```

2. **Git** (for version control)
   - Download from: https://git-scm.com/download/win
   - Verify installation:
     ```cmd
     git --version
     ```

3. **Docker Desktop** (optional, for Redis)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Verify installation:
     ```cmd
     docker --version
     docker-compose --version
     ```

4. **Visual Studio Code** (recommended IDE)
   - Download from: https://code.visualstudio.com/

### Optional Tools

- **Postman** or **Insomnia** for API testing
- **SQLite Browser** for database inspection

---

## Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite3 with better-sqlite3
- **Cache**: Redis (optional)
- **Authentication**: JWT with bcrypt
- **Language**: TypeScript

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios

---

## Windows Installation Guide

### Step 1: Clone the Repository

Open Command Prompt (cmd) or PowerShell and run:

```cmd
git clone <repository-url>
cd se_sanjan2
```

### Step 2: Install Root Dependencies

```cmd
npm install
```

### Step 3: Set Up Backend

#### 3.1 Navigate to Backend Directory

```cmd
cd backend
```

#### 3.2 Install Backend Dependencies

```cmd
npm install
```

#### 3.3 Create Environment File

Create a `.env` file in the `backend` folder by copying the example:

```cmd
copy .env.example .env
```

Edit the `.env` file with Notepad or VS Code and configure your settings:

```cmd
notepad .env
```

**Minimum required configuration:**
```env
NODE_ENV=development
PORT=5000
DB_PATH=./database/couponify.db
JWT_SECRET=your-super-secret-jwt-key-change-this
```

#### 3.4 Build Backend (TypeScript Compilation)

```cmd
npm run build
```

#### 3.5 Return to Root Directory

```cmd
cd ..
```

### Step 4: Set Up Frontend

#### 4.1 Navigate to Frontend Directory

```cmd
cd frontend
```

#### 4.2 Install Frontend Dependencies

```cmd
npm install
```

#### 4.3 Return to Root Directory

```cmd
cd ..
```

### Step 5: Set Up Redis (Optional)

#### Option A: Using Docker (Recommended)

```cmd
docker-compose up -d redis
```

#### Option B: Without Redis

If you don't want to use Redis, the application will continue to work without caching. Just ignore Redis connection errors in the console.

#### Option C: Install Redis on Windows

Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases

---

## Project Structure

```
se_sanjan2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # SQLite configuration
│   │   │   ├── redis.ts           # Redis configuration
│   │   │   └── logger.ts          # Winston logger
│   │   ├── routes/
│   │   │   ├── auth.routes.ts     # Authentication routes
│   │   │   ├── merchant.routes.ts # Merchant routes
│   │   │   ├── customer.routes.ts # Customer routes
│   │   │   └── coupon.routes.ts   # Coupon routes
│   │   └── server.ts              # Main server file
│   ├── database/
│   │   └── couponify.db           # SQLite database (auto-created)
│   ├── logs/                      # Application logs
│   ├── uploads/                   # File uploads
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── merchant/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── Dashboard.tsx
│   │   │   └── customer/
│   │   │       ├── Login.tsx
│   │   │       ├── BrowseCoupons.tsx
│   │   │       └── Wallet.tsx
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       └── couponSlice.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── theme.ts
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Running the Application

### Method 1: Run Both Frontend and Backend Simultaneously (Recommended)

From the **root directory** (`se_sanjan2`), run:

```cmd
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Method 2: Run Frontend and Backend Separately

#### Terminal 1 - Backend

```cmd
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend

Open a new Command Prompt window:

```cmd
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### Method 3: Production Build

#### Build Backend

```cmd
cd backend
npm run build
npm start
```

#### Build Frontend

```cmd
cd frontend
npm run build
```

The production build will be in `frontend/build/` directory.

---

## Available Commands

### Root Directory Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |
| `npm run dev:backend` | Run only backend in development mode |
| `npm run dev:frontend` | Run only frontend in development mode |
| `npm run build` | Build frontend for production |
| `npm run test` | Run all tests (backend + frontend) |
| `npm run test:backend` | Run backend tests |
| `npm run test:frontend` | Run frontend tests |
| `npm run lint` | Lint both frontend and backend |
| `npm run docker:up` | Start Docker containers (Redis) |
| `npm run docker:down` | Stop Docker containers |

### Backend Commands

Navigate to `backend/` directory first: `cd backend`

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend in development mode with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled backend (production) |
| `npm test` | Run backend tests with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint TypeScript files |
| `npm run lint:fix` | Auto-fix linting issues |

### Frontend Commands

Navigate to `frontend/` directory first: `cd frontend`

| Command | Description |
|---------|-------------|
| `npm start` | Run frontend in development mode |
| `npm run build` | Build frontend for production |
| `npm test` | Run frontend tests |
| `npm run lint` | Lint TypeScript/React files |
| `npm run lint:fix` | Auto-fix linting issues |

---

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Health Check

```
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-15T12:00:00.000Z",
  "uptime": 123.456
}
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/merchant` | Register new merchant |
| POST | `/api/v1/auth/register/customer` | Register new customer |
| POST | `/api/v1/auth/login` | Login (email/password) |
| POST | `/api/v1/auth/send-otp` | Send OTP for customer login |
| POST | `/api/v1/auth/verify-otp` | Verify OTP and login |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |
| POST | `/api/v1/auth/logout` | Logout user |

### Merchant Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/merchants/profile` | Get merchant profile |
| PUT | `/api/v1/merchants/profile` | Update merchant profile |
| GET | `/api/v1/merchants/dashboard` | Get dashboard analytics |
| GET | `/api/v1/merchants/coupons` | Get all merchant coupons |
| POST | `/api/v1/merchants/coupons` | Create new coupon |
| GET | `/api/v1/merchants/coupons/:id` | Get coupon by ID |
| PUT | `/api/v1/merchants/coupons/:id` | Update coupon |
| DELETE | `/api/v1/merchants/coupons/:id` | Delete coupon |

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers/profile` | Get customer profile |
| PUT | `/api/v1/customers/profile` | Update customer profile |
| GET | `/api/v1/customers/wallet` | Get customer's coupon wallet |
| POST | `/api/v1/customers/claim/:couponId` | Claim a coupon |
| GET | `/api/v1/customers/redemptions` | Get redemption history |

### Coupon Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/coupons` | Browse/search coupons |
| GET | `/api/v1/coupons/:id` | Get coupon details |
| POST | `/api/v1/coupons/validate` | Validate coupon code |
| POST | `/api/v1/coupons/redeem/initiate` | Initiate redemption (send OTP) |
| POST | `/api/v1/coupons/redeem/verify` | Verify OTP and redeem |

---

## Testing

### Run All Tests

From root directory:

```cmd
npm test
```

### Run Backend Tests Only

```cmd
cd backend
npm test
```

### Run Frontend Tests Only

```cmd
cd frontend
npm test
```

### Run Tests with Coverage

```cmd
npm run test:coverage
```

---

## Database Management

### Database Location

The SQLite database is automatically created at:
```
backend/database/couponify.db
```

### View Database

1. **Using SQLite Browser** (Recommended)
   - Download: https://sqlitebrowser.org/
   - Open `backend/database/couponify.db`

2. **Using Command Line**
   ```cmd
   cd backend\database
   sqlite3 couponify.db
   .tables
   .schema users
   .quit
   ```

### Database Schema

The database includes the following tables:
- `users` - All user accounts
- `merchants` - Merchant profiles
- `customers` - Customer profiles
- `coupons` - Coupon details
- `claimed_coupons` - Customer wallet
- `redemptions` - Redemption history
- `otps` - OTP verification
- `notifications` - User notifications
- `audit_logs` - System audit trail
- `sessions` - User sessions

---

## Deployment

### Production Build

1. **Build Backend:**
   ```cmd
   cd backend
   npm run build
   ```

2. **Build Frontend:**
   ```cmd
   cd frontend
   npm run build
   ```

3. **Serve Production Build:**
   ```cmd
   cd backend
   set NODE_ENV=production
   npm start
   ```

### Docker Deployment (Optional)

```cmd
docker-compose up -d
```

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```cmd
REM Find process using port 5000
netstat -ano | findstr :5000

REM Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 2: Module Not Found

**Error**: `Cannot find module 'express'` or similar

**Solution**:
```cmd
REM Delete node_modules and reinstall
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

REM Same for frontend
cd ..\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue 3: TypeScript Compilation Errors

**Solution**:
```cmd
cd backend
npm run build
```

Check the error messages and fix TypeScript errors in the code.

### Issue 4: Redis Connection Error

**Solution**:

If you don't need Redis, ignore the error. The app will continue without caching.

If you need Redis:
```cmd
REM Start Redis with Docker
docker-compose up -d redis

REM Or install Redis for Windows
REM Download from: https://github.com/microsoftarchive/redis/releases
```

### Issue 5: Database Locked

**Error**: `database is locked`

**Solution**:
```cmd
REM Close all connections to the database
REM Restart the backend server
cd backend
npm run dev
```

### Issue 6: Frontend Not Loading

**Solution**:
```cmd
REM Clear cache and rebuild
cd frontend
rmdir /s /q node_modules
rmdir /s /q build
del package-lock.json
npm install
npm start
```

### Issue 7: CORS Errors

**Solution**:

Make sure backend `.env` has:
```env
CORS_ORIGIN=http://localhost:3000
```

Restart backend:
```cmd
cd backend
npm run dev
```

---

## Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] Git installed
- [ ] Project cloned
- [ ] Root dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Backend `.env` file created and configured
- [ ] Backend built (`cd backend && npm run build`)
- [ ] Docker Desktop running (optional, for Redis)
- [ ] Both servers running (`npm run dev` from root)
- [ ] Browser opened to `http://localhost:3000`
- [ ] API health check works `http://localhost:5000/health`

---

## Development Workflow

### Daily Development

1. **Start Development Servers**
   ```cmd
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `backend/src/` or `frontend/src/`
   - Changes will hot-reload automatically

3. **Test Your Changes**
   ```cmd
   npm test
   ```

4. **Commit Your Work**
   ```cmd
   git add .
   git commit -m "Your commit message"
   git push
   ```

### Before Committing

```cmd
REM Run linting
npm run lint

REM Run tests
npm test

REM Ensure builds work
cd backend && npm run build
cd ..\frontend && npm run build
```

---

## Environment Variables Reference

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
DB_PATH=./database/couponify.db

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-min-32-chars-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS (optional)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-provider.com/send

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

---

## Support & Resources

- **Documentation**: This README file
- **Issue Tracker**: GitHub Issues
- **Course**: UE23CS341A - Software Engineering & Project Management
- **Faculty Supervisor**: @sheela824
- **Teaching Assistants**: @Omicarr, @PES2UG22CS175, @PES2UG22CS190, @Accuracy-exe

---

## License

MIT License - See LICENSE file for details

---

## Contributors

Couponify Team - Course UE23CS341A

---

**Last Updated**: November 16, 2025
**Version**: 1.0
**Status**: Development

---

## Next Steps

After setting up the project, refer to the PRD (Product Requirements Document) for:
- Sprint 1 implementation details
- User stories and acceptance criteria
- Technical specifications
- Testing requirements

Happy Coding! 🚀
