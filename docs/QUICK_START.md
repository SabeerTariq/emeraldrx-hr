# Quick Start Guide

Get up and running with EmeraldRx HRM in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
mysql --version   # Should be v8.0+ (or mariadb --version for v10.5+)
```

## Installation Steps

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Database

Create MySQL database:
```sql
CREATE DATABASE emeraldsrx_hrm;
```

### 3. Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# .env.local is already configured for development
```

### 4. Initialize Database
```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 5. Set Up ShadCN UI
```bash
cd frontend
npx shadcn@latest init
# Accept defaults, then add components:
npx shadcn@latest add button card input form table dialog
```

### 6. Start Development
```bash
# From root directory
npm run dev
```

## Verify Installation

- ✅ Backend: http://localhost:5000/health
- ✅ Frontend: http://localhost:3000
- ✅ Database: Connect with MySQL client or `mysql -u root -p emeraldsrx_hrm`

## Common Issues

**Port in use?** Change ports in `.env` files.

**Database error?** Check MySQL is running and credentials are correct.

**Module errors?** Delete `node_modules` and reinstall.

## Next Steps

1. Read `SETUP.md` for detailed setup
2. Review `docs/PROJECT_STRUCTURE.md` for architecture
3. Check `docs/TECH_STACK.md` for technologies used
4. Start building features!

