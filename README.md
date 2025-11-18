# EmeraldRx HR Management System

A comprehensive HR Management System designed for a heavily regulated compounding pharmacy environment. Built with modern technologies to support compliance tracking, training, role-based access, and internal operations.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **Recharts** - Dashboard charts
- **React Calendar** - Scheduling interface
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **mysql2** - MySQL database client
- **MySQL** - Relational database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Zod** - Request validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **TypeScript** - Type checking

## 📁 Project Structure

```
emeraldsrxhrm/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components
│   │   ├── ui/              # ShadCN UI components
│   │   ├── layout/          # Layout components
│   │   ├── features/        # Feature-specific components
│   │   └── shared/          # Shared/reusable components
│   ├── lib/                 # Utilities and helpers
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── public/              # Static assets
│   └── styles/              # Global styles
│
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Request validators
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration files
│   │   └── database/        # Database migrations and seeds
│   └── tests/               # Backend tests
│
├── shared/                   # Shared code between frontend/backend
│   └── types/               # Shared TypeScript types
│
└── docs/                     # Documentation
```

## 🎯 Core Features

1. **Employee Management** - Complete employee lifecycle management
2. **License & Certification Tracking** - Track licenses with expiry reminders
3. **Training & Compliance** - Training modules and policy acknowledgments
4. **Shift Scheduling** - Calendar-based scheduling with conflict detection
5. **Leave Management** - PTO, sick leave with approval workflows
6. **Recruitment & Onboarding** - Onboarding task tracking
7. **Performance Evaluations** - Quarterly/annual reviews
8. **Incident Management** - HIPAA and safety incident tracking
9. **Role-Based Access Control** - Granular permissions system
10. **Dashboard & Notifications** - Real-time alerts and reminders

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+ or MariaDB 10.5+
- npm or yarn or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   ```

3. Set up environment variables (see `.env.example` files)

4. Run database migrations:
   ```bash
   cd backend
   npm run db:migrate
   ```

5. Seed initial data:
   ```bash
   npm run db:seed
   ```

6. Start development servers:
   ```bash
   # Backend (from backend/)
   npm run dev
   
   # Frontend (from frontend/)
   npm run dev
   ```

## 📝 Environment Variables

See `.env.example` files in both `frontend/` and `backend/` directories.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📄 License

Proprietary - EmeraldRx HR Management System

