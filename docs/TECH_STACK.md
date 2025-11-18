# Technology Stack - EmeraldRx HR Management System

## Overview

This document details all technologies, libraries, and tools used in the EmeraldRx HR Management System.

## Frontend Stack

### Core Framework
- **Next.js 14** - React framework with App Router
  - Server-side rendering
  - API routes
  - File-based routing
  - Image optimization

### Language & Type Safety
- **TypeScript 5.3+** - Type-safe JavaScript
- **React 18.3+** - UI library

### Styling
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Tailwind CSS Animate** - Animation utilities
- **CSS Variables** - Theming support

### UI Component Library
- **ShadCN UI** - Modern, accessible component library
  - Built on Radix UI primitives
  - Fully customizable
  - Copy-paste components (not a dependency)

### Radix UI Primitives
- `@radix-ui/react-accordion` - Accordion component
- `@radix-ui/react-alert-dialog` - Alert dialogs
- `@radix-ui/react-avatar` - Avatar component
- `@radix-ui/react-checkbox` - Checkbox input
- `@radix-ui/react-dialog` - Modal dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-label` - Form labels
- `@radix-ui/react-popover` - Popover component
- `@radix-ui/react-progress` - Progress bars
- `@radix-ui/react-radio-group` - Radio buttons
- `@radix-ui/react-select` - Select dropdowns
- `@radix-ui/react-separator` - Separator line
- `@radix-ui/react-slider` - Slider input
- `@radix-ui/react-slot` - Slot component
- `@radix-ui/react-switch` - Toggle switch
- `@radix-ui/react-tabs` - Tab navigation
- `@radix-ui/react-toast` - Toast notifications
- `@radix-ui/react-tooltip` - Tooltips

### Form Management
- **React Hook Form 7.51+** - Performant form library
- **@hookform/resolvers** - Validation resolvers
- **Zod 3.23+** - Schema validation

### Data Fetching
- **TanStack Query (React Query) 5.28+** - Server state management
  - Caching
  - Background updates
  - Optimistic updates

### HTTP Client
- **Axios 1.7+** - HTTP client with interceptors

### Date Handling
- **date-fns 3.3+** - Date utility library
- **react-calendar 4.9+** - Calendar component
- **react-day-picker 8.10+** - Date picker component

### Charts & Visualization
- **Recharts 2.12+** - Composable charting library

### State Management
- **Zustand 4.5+** - Lightweight state management

### Icons
- **Lucide React 0.378+** - Icon library

### Notifications
- **Sonner 1.4+** - Toast notification library

### Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes
- **class-variance-authority** - Component variants

## Backend Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18+** - Web framework

### Language & Type Safety
- **TypeScript 5.3+** - Type-safe JavaScript
- **tsx** - TypeScript execution

### Database
- **MySQL 8.0+** or **MariaDB 10.5+** - Relational database
- **mysql2 3.9+** - MySQL client for Node.js
  - Promise-based API
  - Connection pooling
  - Direct SQL queries

### Authentication & Security
- **jsonwebtoken 9.0+** - JWT token generation
- **bcryptjs 2.4+** - Password hashing
- **helmet 7.1+** - Security headers
- **express-rate-limit 7.1+** - Rate limiting

### Validation
- **Zod 3.23+** - Schema validation
- **express-validator 7.0+** - Request validation

### File Handling
- **multer 1.4+** - File upload middleware

### Email
- **nodemailer 6.9+** - Email sending

### Scheduling
- **node-cron 3.0+** - Cron job scheduling
  - License expiry reminders
  - Training due date alerts

### Utilities
- **cors 2.8+** - CORS middleware
- **morgan 1.10+** - HTTP request logger
- **compression 1.7+** - Response compression
- **dotenv 16.4+** - Environment variables

## Development Tools

### Linting & Formatting
- **ESLint 8.57+** - Code linting
- **@typescript-eslint/parser** - TypeScript ESLint parser
- **@typescript-eslint/eslint-plugin** - TypeScript ESLint rules

### Testing (Planned)
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **Supertest** - API testing

### Build Tools
- **TypeScript Compiler** - Type checking and compilation
- **Next.js Build System** - Frontend build
- **tsc** - TypeScript compilation

## Database Schema

### Core Models
- Employees
- Departments
- Roles
- EmployeeRoles (many-to-many)

### License & Certification
- Licenses
- Documents

### Training & Compliance
- Trainings
- EmployeeTrainingRecords
- Policies
- EmployeePolicyAcks

### Scheduling
- Shifts
- ShiftAssignments

### Leave Management
- LeaveRequests

### Onboarding
- OnboardingTasks
- EmployeeOnboardingTasks

### Performance
- PerformanceEvaluations

### Incidents
- Incidents
- CorrectiveActions

### Notifications
- Notifications

## Architecture Patterns

### Frontend
- **Component-Based Architecture** - Reusable React components
- **Feature-Based Organization** - Group by feature, not type
- **Custom Hooks** - Reusable logic
- **Server Components** - Next.js App Router

### Backend
- **MVC Pattern** - Model-View-Controller
- **Service Layer** - Business logic separation
- **Repository Pattern** - Data access abstraction (via mysql2)
- **Middleware Pattern** - Request/response processing

### Database
- **Relational Database** - MySQL/MariaDB
- **Normalized Schema** - Proper relationships
- **Indexes** - Performance optimization
- **Cascading Deletes** - Data integrity

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Rate limiting
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection

## Performance Optimizations

- React Query caching
- Next.js image optimization
- Response compression
- Database indexes
- Lazy loading
- Code splitting

## Future Considerations

- Redis for caching
- WebSocket for real-time updates
- Elasticsearch for search
- Docker containerization
- CI/CD pipeline
- Monitoring and logging (e.g., Sentry, LogRocket)

