# Setup Guide - EmeraldRx HR Management System

This guide will help you set up the development environment for the EmeraldRx HR Management System.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) or **MariaDB** (v10.5 or higher) - [Download MySQL](https://dev.mysql.com/downloads/) or [Download MariaDB](https://mariadb.org/download/)
- **npm** or **yarn** or **pnpm** (package manager)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone and Navigate

```bash
cd emeraldsrxhrm
```

## Step 2: Install Dependencies

### Option A: Install All at Once (Recommended)
```bash
npm run install:all
```

### Option B: Install Separately
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

## Step 3: Set Up MySQL Database

1. **Create a new MySQL database:**
   ```sql
   CREATE DATABASE emeraldsrx_hrm;
   ```

2. **Note your database connection details:**
   - Host: `localhost` (or your MySQL host)
   - Port: `3306` (default)
   - Database: `emeraldsrx_hrm`
   - Username: Your MySQL username
   - Password: Your MySQL password

## Step 4: Configure Environment Variables

### Backend Configuration

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` and update the following:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/emeraldsrx_hrm"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   FRONTEND_URL="http://localhost:3000"
   ```

   **Important:** 
   - Replace `username` and `password` with your MySQL credentials
   - Generate a strong random string for `JWT_SECRET` (you can use: `openssl rand -base64 32`)
   - Update email settings if you want email notifications

### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Edit `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME=EmeraldRx HRM
   ```

## Step 5: Set Up Database Schema

1. **Run Database Migrations:**
   ```bash
   cd backend
   npm run db:migrate
   ```
   This will create all the database tables from the SQL schema file.

2. **Seed Initial Data:**
   ```bash
   npm run db:seed
   ```
   This will populate:
   - Departments (Pharmacy, HR, Compliance, Administration)
   - Roles (HR Admin, Compliance Officer, Pharmacy Manager, Department Manager, Employee)
   - Default onboarding tasks
   - Default training modules

## Step 6: Initialize ShadCN UI Components

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Initialize ShadCN UI (if not already done):
   ```bash
   npx shadcn@latest init
   ```
   - Use default settings (recommended)
   - Style: Default
   - Base color: Neutral
   - CSS variables: Yes

3. Add commonly used components:
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add input
   npx shadcn@latest add form
   npx shadcn@latest add table
   npx shadcn@latest add dialog
   npx shadcn@latest add dropdown-menu
   npx shadcn@latest add select
   npx shadcn@latest add toast
   npx shadcn@latest add calendar
   ```

## Step 7: Start Development Servers

### Option A: Run Both Servers (Recommended)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000`

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 8: Verify Installation

1. **Check Backend Health:**
   Open `http://localhost:5000/health` in your browser.
   You should see: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend:**
   Open `http://localhost:3000` in your browser.
   You should see the welcome page.

3. **Check Database:**
   You can use any MySQL client (MySQL Workbench, phpMyAdmin, DBeaver, etc.) or connect via command line:
   ```bash
   mysql -u root -p emeraldsrx_hrm
   ```
   Then run: `SHOW TABLES;` to see all created tables.

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: Check services or run `mysql --version`
- Verify database credentials in `.env`
- Check if database exists: `mysql -u username -p -e "SHOW DATABASES;"` (list all databases)
- Test connection: `mysql -u username -p -h localhost emeraldsrx_hrm`

### Port Already in Use

- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): Change port in `frontend/package.json` scripts or use: `PORT=3001 npm run dev`

### Database Migration Issues

- Re-run migrations: `npm run db:migrate`
- Check MySQL connection: Verify credentials in `.env` file
- View database schema: Connect to MySQL and run `SHOW TABLES;`
- Reset database (⚠️ deletes all data): Drop and recreate database, then run migrations again

### Module Not Found Errors

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. **Review the Project Structure:** See `docs/PROJECT_STRUCTURE.md`
2. **Read the README:** See `README.md` for feature overview
3. **Start Development:** Begin building features!

## Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed initial data
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Production Deployment

See `docs/DEPLOYMENT.md` (to be created) for production deployment instructions.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

