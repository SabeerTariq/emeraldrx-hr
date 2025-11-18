# Project Structure Documentation

## Overview

This document outlines the complete folder structure for the EmeraldRx HR Management System.

## Root Directory

```
emeraldsrxhrm/
├── frontend/              # Next.js frontend application
├── backend/              # Express.js backend API
├── shared/               # Shared code between frontend/backend
├── docs/                 # Project documentation
├── package.json          # Root package.json for workspace management
└── README.md            # Project README
```

## Frontend Structure (`frontend/`)

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── licenses/
│   │   ├── training/
│   │   ├── scheduling/
│   │   ├── leave/
│   │   ├── onboarding/
│   │   ├── evaluations/
│   │   ├── incidents/
│   │   └── settings/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (other ShadCN components)
│   │
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── features/                 # Feature-specific components
│   │   ├── employees/
│   │   │   ├── EmployeeList.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   └── EmployeeCard.tsx
│   │   ├── licenses/
│   │   ├── training/
│   │   ├── scheduling/
│   │   ├── leave/
│   │   ├── onboarding/
│   │   ├── evaluations/
│   │   └── incidents/
│   │
│   ├── shared/                   # Shared/reusable components
│   │   ├── DataTable.tsx
│   │   ├── PageHeader.tsx
│   │   ├── StatusBadge.tsx
│   │   └── LoadingSpinner.tsx
│   │
│   └── providers.tsx             # React providers
│
├── lib/
│   ├── utils.ts                 # Utility functions (cn, formatDate, etc.)
│   ├── api.ts                   # API client configuration
│   ├── validations.ts           # Zod schemas
│   └── constants.ts             # App constants
│
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   ├── useEmployees.ts          # Employee data hook
│   ├── useLicenses.ts           # License data hook
│   └── ... (other custom hooks)
│
├── types/
│   ├── index.ts                 # Shared types
│   ├── employee.ts
│   ├── license.ts
│   └── ... (other type definitions)
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── styles/                       # Additional styles (if needed)
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── components.json               # ShadCN configuration
└── .env.example
```

## Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── controllers/              # Request handlers
│   │   ├── authController.ts
│   │   ├── employeeController.ts
│   │   ├── licenseController.ts
│   │   ├── trainingController.ts
│   │   ├── schedulingController.ts
│   │   ├── leaveController.ts
│   │   ├── onboardingController.ts
│   │   ├── evaluationController.ts
│   │   └── incidentController.ts
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── licenseService.ts
│   │   ├── trainingService.ts
│   │   ├── notificationService.ts
│   │   ├── emailService.ts
│   │   └── schedulerService.ts   # License expiry reminders
│   │
│   ├── routes/                   # API routes
│   │   ├── index.ts              # Route aggregator
│   │   ├── authRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── licenseRoutes.ts
│   │   ├── trainingRoutes.ts
│   │   ├── schedulingRoutes.ts
│   │   ├── leaveRoutes.ts
│   │   ├── onboardingRoutes.ts
│   │   ├── evaluationRoutes.ts
│   │   └── incidentRoutes.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts               # JWT authentication
│   │   ├── authorize.ts         # Role-based authorization
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── notFoundHandler.ts   # 404 handler
│   │   ├── validator.ts          # Request validation
│   │   └── upload.ts             # File upload handling
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── password.ts          # Password hashing
│   │   ├── jwt.ts               # JWT token generation
│   │   └── dateUtils.ts         # Date utilities
│   │
│   ├── validators/
│   │   ├── employeeValidator.ts
│   │   ├── licenseValidator.ts
│   │   ├── trainingValidator.ts
│   │   └── ... (other validators)
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── express.d.ts         # Express type extensions
│   │   └── ... (other types)
│   │
│   ├── config/
│   │   ├── database.ts          # MySQL connection pool
│   │   ├── email.ts             # Email configuration
│   │   └── constants.ts          # Backend constants
│   │
│   └── index.ts                  # Application entry point
│
├── database/
│   ├── schema.sql               # Database schema (SQL)
│   ├── migrate.ts               # Migration script
│   └── seed.ts                  # Database seed script
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── uploads/                      # File uploads directory
│
├── package.json
├── tsconfig.json
└── .env.example
```

## Shared Structure (`shared/`)

```
shared/
└── types/
    ├── index.ts                 # Shared TypeScript types
    ├── api.ts                   # API request/response types
    └── common.ts                # Common types
```

## Key Design Decisions

### Frontend
- **Next.js App Router**: Modern routing with server components support
- **ShadCN UI**: Copy-paste components for maximum customization
- **TanStack Query**: Efficient data fetching and caching
- **Zod**: Type-safe form validation
- **TypeScript**: Full type safety

### Backend
- **Express.js**: Flexible and well-established framework
- **mysql2**: Simple MySQL client with connection pooling
- **MySQL/MariaDB**: Robust relational database
- **JWT**: Stateless authentication
- **Modular Architecture**: Separation of concerns (controllers, services, routes)

### Database
- **MySQL/MariaDB**: Handles complex relationships and compliance requirements
- **Direct SQL Queries**: Simple and straightforward database access
- **Normalized Schema**: Proper relationships and indexes

## File Naming Conventions

- **Components**: PascalCase (e.g., `EmployeeList.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase (e.g., `employeeTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## Next Steps

1. Install dependencies: `npm run install:all`
2. Set up environment variables
3. Run database migrations: `cd backend && npm run db:migrate`
4. Seed database: `cd backend && npm run db:seed`
5. Start development servers: `npm run dev`

