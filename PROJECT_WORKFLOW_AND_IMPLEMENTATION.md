# EmeraldRx HR Management System - Complete Workflow & Implementation Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema & Models](#database-schema--models)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Module Workflows](#module-workflows)
8. [API Endpoints](#api-endpoints)
9. [Key Features & Functionalities](#key-features--functionalities)
10. [Security Implementation](#security-implementation)
11. [File Upload System](#file-upload-system)
12. [Settings & Customization](#settings--customization)
13. [Development Workflow](#development-workflow)

---

## Project Overview

**EmeraldRx HR Management System** is a comprehensive, full-stack HR management solution designed specifically for a heavily regulated compounding pharmacy environment. The system manages employee lifecycle, compliance tracking, training, scheduling, and regulatory requirements.

### Core Purpose
- Employee lifecycle management
- License and certification tracking with expiry alerts
- Training and compliance management
- Shift scheduling with conflict detection
- Leave management with approval workflows
- Incident reporting and corrective actions
- Performance evaluations
- Onboarding task tracking
- Policy acknowledgments
- Real-time notifications

---

## Architecture & Tech Stack

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Emerald green theme
- **UI Components**: ShadCN UI (Radix UI primitives)
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Charts**: Recharts (ready for dashboard visualizations)

### Backend Stack
- **Framework**: Express.js with TypeScript
- **Database**: MySQL 8.0+ (using mysql2 package, no ORM)
- **Authentication**: JWT + bcrypt (ready for implementation)
- **File Upload**: Multer
- **Email**: Nodemailer (ready for notifications)
- **Validation**: Zod + express-validator
- **Security**: Helmet, CORS, compression

### Development Tools
- **Package Manager**: npm workspaces
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build**: TypeScript compilation

---

## Project Structure

```
emeraldsrxhrm/
├── frontend/                    # Next.js frontend application
│   ├── app/
│   │   ├── (main)/             # Main application pages (with sidebar)
│   │   │   ├── dashboard/
│   │   │   ├── employee-management/
│   │   │   ├── license-tracking/
│   │   │   ├── training-compliance/
│   │   │   ├── shift-scheduling/
│   │   │   ├── leave-management/
│   │   │   ├── onboarding-tasks/
│   │   │   ├── performance-evaluations/
│   │   │   ├── incident-management/
│   │   │   ├── system-settings/
│   │   │   └── layout.tsx       # Main layout with Navigation
│   │   ├── api/                # API routes (test-logo)
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # ShadCN UI components (21 components)
│   │   ├── layout/
│   │   │   └── Navigation.tsx  # Sidebar navigation with theme/logo
│   │   ├── modals/             # Feature modals (3 modals)
│   │   ├── notifications/
│   │   │   └── NotificationBell.tsx
│   │   └── providers.tsx       # React Query & Toast providers
│   ├── lib/
│   │   ├── api.ts              # Axios API client configuration
│   │   ├── utils.ts             # Utility functions (cn, date formatting)
│   │   ├── logo-storage.ts     # Logo management utilities
│   │   ├── sidebar-theme.ts    # Sidebar theme management
│   │   └── sidebar-theme-sync.ts # Synchronous theme loading
│   └── scripts/                # Utility scripts
│
├── backend/                     # Express.js backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts     # MySQL connection pool & utilities
│   │   ├── routes/              # API route handlers (16 routes)
│   │   │   ├── index.ts        # Route aggregator
│   │   │   ├── employees.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── licenses.ts
│   │   │   ├── training.ts
│   │   │   ├── scheduling.ts
│   │   │   ├── leave.ts
│   │   │   ├── onboarding.ts
│   │   │   ├── evaluations.ts
│   │   │   ├── incidents.ts
│   │   │   ├── notifications.ts
│   │   │   ├── policies.ts
│   │   │   ├── upload.ts
│   │   │   ├── departments.ts
│   │   │   ├── roles.ts
│   │   │   └── settings.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts  # Global error handler
│   │   │   └── notFoundHandler.ts # 404 handler
│   │   ├── database/
│   │   │   ├── schema.sql      # Complete database schema
│   │   │   ├── migrate.ts      # Migration script
│   │   │   └── seed.ts         # Seed data script
│   │   └── index.ts            # Express server setup
│   ├── uploads/                # File upload directory
│   └── dist/                   # Compiled TypeScript output
│
├── shared/                      # Shared code between frontend/backend
│   └── types/                   # Shared TypeScript types
│
└── docs/                        # Comprehensive documentation
    ├── PROJECT_STRUCTURE.md
    ├── TECH_STACK.md
    ├── COMPLETE_FEATURES.md
    ├── API_INTEGRATION.md
    └── ... (other docs)
```

---

## Database Schema & Models

### Core Tables

#### 1. **Departments**
- Stores organizational departments
- Fields: `id`, `name`, `description`, `createdAt`, `updatedAt`
- Indexed on `name`

#### 2. **Roles**
- Defines user roles with permissions
- Fields: `id`, `name`, `description`, `permissions` (JSON), `createdAt`, `updatedAt`
- Supports granular permission system

#### 3. **Employees**
- Core employee information
- Fields: `id` (UUID), `employeeId` (unique), `firstName`, `lastName`, `email` (unique), `phone`, `dateOfBirth`, `address`, `city`, `state`, `zipCode`, `hireDate`, `terminationDate`, `isActive`, `departmentId` (FK), `password` (hashed), `createdAt`, `updatedAt`
- Indexed on: `email`, `employeeId`, `departmentId`, `isActive`

#### 4. **Employee Roles** (Many-to-Many)
- Links employees to roles
- Fields: `id`, `employeeId` (FK), `roleId` (FK), `createdAt`

### License & Document Management

#### 5. **Licenses**
- Tracks employee licenses and certifications
- Fields: `id`, `employeeId` (FK), `type`, `licenseNumber`, `issuingOrganization`, `issueDate`, `expiryDate`, `isActive`, `notes`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `expiryDate`, `isActive`

#### 6. **Documents**
- Stores employee documents (licenses, certificates, etc.)
- Fields: `id`, `employeeId` (FK), `name`, `type`, `fileUrl`, `fileSize`, `mimeType`, `uploadedBy` (FK), `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `type`

### Training & Compliance

#### 7. **Trainings**
- Training module definitions
- Fields: `id`, `title`, `description`, `category`, `duration`, `isRequired`, `createdAt`, `updatedAt`
- Indexed on: `category`

#### 8. **Employee Training Records**
- Tracks employee training completion
- Fields: `id`, `employeeId` (FK), `trainingId` (FK), `assignedDate`, `completedDate`, `dueDate`, `status` (pending/completed/overdue), `score`, `notes`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `trainingId`, `status`, `dueDate`

#### 9. **Policies**
- Company policy documents
- Fields: `id`, `title`, `description`, `category`, `documentUrl`, `version`, `isActive`, `createdAt`, `updatedAt`
- Indexed on: `category`

#### 10. **Employee Policy Acknowledgments**
- Tracks policy acknowledgments
- Fields: `id`, `employeeId` (FK), `policyId` (FK), `acknowledgedAt`, `ipAddress`, `createdAt`
- Unique constraint on `(employeeId, policyId)`

### Scheduling

#### 11. **Shifts**
- Shift definitions
- Fields: `id`, `date`, `startTime`, `endTime`, `departmentId` (FK), `notes`, `createdAt`, `updatedAt`
- Indexed on: `date`

#### 12. **Shift Assignments**
- Employee-shift assignments
- Fields: `id`, `shiftId` (FK), `employeeId` (FK), `status` (scheduled/confirmed/cancelled), `notes`, `createdAt`, `updatedAt`
- Indexed on: `shiftId`, `employeeId`, `status`

### Leave Management

#### 13. **Leave Requests**
- Employee leave requests
- Fields: `id`, `employeeId` (FK), `type` (PTO/sick/personal), `startDate`, `endDate`, `daysRequested`, `reason`, `status` (pending/approved/rejected), `approvedBy` (FK), `approvedAt`, `rejectionReason`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `status`, `startDate`, `endDate`

### Onboarding

#### 14. **Onboarding Tasks**
- Template onboarding tasks
- Fields: `id`, `title`, `description`, `category`, `isRequired`, `order`, `createdAt`, `updatedAt`

#### 15. **Employee Onboarding Tasks**
- Employee-specific onboarding progress
- Fields: `id`, `employeeId` (FK), `taskId` (FK), `assignedDate`, `completedDate`, `status` (pending/in_progress/completed), `assignedBy` (FK), `notes`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `taskId`, `status`

### Performance Management

#### 16. **Performance Evaluations**
- Performance review records
- Fields: `id`, `employeeId` (FK), `evaluatorId` (FK), `period` (quarterly/annual), `evaluationDate`, `overallRating`, `goals` (JSON), `strengths`, `improvements`, `comments`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `period`

### Incident Management

#### 17. **Incidents**
- Incident reports (HIPAA, safety, etc.)
- Fields: `id`, `type`, `title`, `description`, `employeeId` (FK), `reportedBy` (FK), `severity` (low/medium/high/critical), `status` (open/in_progress/resolved/closed), `occurredAt`, `reportedAt`, `resolvedAt`, `resolutionNotes`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `status`, `type`, `severity`

#### 18. **Corrective Actions**
- Corrective actions linked to incidents
- Fields: `id`, `incidentId` (FK), `employeeId` (FK), `title`, `description`, `dueDate`, `completedAt`, `status` (pending/in_progress/completed), `createdAt`, `updatedAt`
- Indexed on: `incidentId`, `employeeId`, `status`, `dueDate`

### System Tables

#### 19. **Emergency Contacts**
- Employee emergency contact information
- Fields: `id`, `employeeId` (FK), `name`, `relationship`, `phone`, `email`, `isPrimary`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`

#### 20. **Notifications**
- System notifications
- Fields: `id`, `employeeId` (FK), `type`, `title`, `message`, `isRead`, `readAt`, `link`, `createdAt`, `updatedAt`
- Indexed on: `employeeId`, `isRead`, `createdAt`

#### 21. **System Settings**
- Application-wide settings
- Fields: `id`, `settingKey` (unique), `settingValue` (JSON), `description`, `createdAt`, `updatedAt`
- Used for: sidebar theme, sidebar logo, and other configurable settings

### Database Features
- **Character Set**: UTF8MB4 (full Unicode support)
- **Engine**: InnoDB (foreign key support)
- **Primary Keys**: VARCHAR(36) UUIDs
- **Foreign Keys**: Properly configured with CASCADE/SET NULL
- **Indexes**: Optimized for common queries
- **Timestamps**: Automatic `createdAt` and `updatedAt` tracking

---

## Backend Implementation

### Server Configuration (`backend/src/index.ts`)

**Express Server Setup:**
- Port: 5000 (configurable via `PORT` env variable)
- Middleware stack:
  - **Helmet**: Security headers
  - **CORS**: Configured for multiple origins (development-friendly)
  - **Compression**: Response compression
  - **Morgan**: HTTP request logging
  - **Body Parser**: JSON and URL-encoded (10MB limit)
  - **Static File Serving**: `/uploads` directory for file access

**Key Features:**
- Health check endpoint: `/health` (includes database connection status)
- Debug endpoint: `/debug/uploads` (lists uploaded files)
- Global error handling middleware
- 404 handler for undefined routes

### Database Configuration (`backend/src/config/database.ts`)

**Connection Pool:**
- MySQL connection pool with configurable limits
- Environment-based configuration:
  - `DB_HOST` (default: localhost)
  - `DB_PORT` (default: 3306)
  - `DB_USER` (default: root)
  - `DB_PASSWORD`
  - `DB_NAME` (default: emeraldsrx_hrm)

**Database Utilities:**
- `query(sql, params)`: Execute parameterized queries
- `queryOne(sql, params)`: Get single result
- `transaction(callback)`: Execute queries in transaction
- `testConnection()`: Verify database connectivity
- `getConnection()`: Get connection from pool
- `closePool()`: Graceful shutdown

**Security:**
- All queries use parameterized statements (SQL injection prevention)
- Connection pooling for performance
- Transaction support for data integrity

### Route Handlers

All routes follow RESTful conventions and return JSON responses in format:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message" (if success: false)
}
```

#### 1. **Employees Routes** (`/api/employees`)
- `GET /` - List all employees with department and roles
- `GET /:id` - Get single employee details
- `POST /` - Create new employee (with password hashing)
- `PUT /:id` - Update employee (partial updates supported)
- `POST /:id/emergency-contacts` - Add emergency contacts
- `POST /:id/roles` - Assign roles to employee

**Implementation Details:**
- Password hashing using bcrypt (10 rounds)
- UUID generation for primary keys
- Support for partial updates
- Cascade deletes for related records

#### 2. **Dashboard Routes** (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics:
  - Total active employees
  - Pending leave approvals
  - License expiries (next 90 days)
  - Overdue training records
  - Open incidents
  - Upcoming shifts (next 7 days)

#### 3. **Licenses Routes** (`/api/licenses`)
- Full CRUD operations for license management
- Expiry date tracking
- Document association

#### 4. **Training Routes** (`/api/training`)
- Training module management
- Employee training record tracking
- Status management (pending/completed/overdue)
- Due date tracking

#### 5. **Scheduling Routes** (`/api/scheduling`)
- Shift creation and management
- Employee shift assignments
- Conflict detection
- Calendar-based queries

#### 6. **Leave Routes** (`/api/leave`)
- Leave request submission
- Approval workflow
- Status management
- Date range queries

#### 7. **Onboarding Routes** (`/api/onboarding`)
- Onboarding task templates
- Employee onboarding progress tracking
- Task assignment and completion

#### 8. **Evaluations Routes** (`/api/evaluations`)
- Performance evaluation creation
- Rating and goal tracking
- Period-based queries (quarterly/annual)

#### 9. **Incidents Routes** (`/api/incidents`)
- Incident reporting
- Severity and status management
- Corrective action tracking
- Resolution workflow

#### 10. **Notifications Routes** (`/api/notifications`)
- Notification creation
- Mark as read functionality
- Unread count queries
- Employee-specific notifications

#### 11. **Policies Routes** (`/api/policies`)
- Policy document management
- Version control
- Employee acknowledgment tracking
- IP address logging for compliance

#### 12. **Upload Routes** (`/api/upload`)
- File upload handling (Multer)
- File type validation (images, PDFs, Word docs)
- File size limits (10MB)
- Secure file storage in `/uploads` directory

#### 13. **Departments Routes** (`/api/departments`)
- Department CRUD operations
- Employee count queries

#### 14. **Roles Routes** (`/api/roles`)
- Role management
- Permission configuration (JSON)

#### 15. **Settings Routes** (`/api/settings`)
- `GET /:key` - Get specific setting
- `PUT /:key` - Update setting
- `GET /` - Get all settings
- Special endpoints:
  - `/api/settings/sidebar_theme` - Sidebar color theme
  - `/api/settings/sidebar_logo` - Sidebar logo URL

### Middleware

#### Error Handler (`middleware/errorHandler.ts`)
- Global error catching
- Consistent error response format
- Error logging
- Status code handling

#### Not Found Handler (`middleware/notFoundHandler.ts`)
- 404 response for undefined routes
- JSON error format

### Database Migrations & Seeding

#### Migration Script (`database/migrate.ts`)
- Reads `schema.sql` file
- Executes all CREATE TABLE statements
- Handles errors gracefully
- Command: `npm run db:migrate`

#### Seed Script (`database/seed.ts`)
- Populates initial data:
  - 4 Departments (Pharmacy, HR, Compliance, Administration)
  - 5 Roles with permissions (HR Admin, Compliance Officer, Pharmacy Manager, Department Manager, Employee)
  - 4 Onboarding tasks
  - 3 Training modules
- Command: `npm run db:seed`

---

## Frontend Implementation

### Application Structure

#### Root Layout (`app/layout.tsx`)
- Wraps entire application
- Includes blocking script for theme/logo loading (prevents flash)
- Providers setup (React Query, Toast)
- Metadata configuration

#### Main Layout (`app/(main)/layout.tsx`)
- Sidebar navigation (fixed left)
- Top bar with notification bell
- Main content area with proper spacing
- Responsive design

### Navigation Component (`components/layout/Navigation.tsx`)

**Features:**
- Dynamic sidebar theming (from database)
- Custom logo support (uploaded via settings)
- Active route highlighting
- Icon-based navigation
- Scrollable navigation list
- Theme synchronization (prevents flash on refresh)

**Navigation Items:**
1. Dashboard
2. Employee Management
3. License Tracking
4. Training & Compliance
5. Shift Scheduling
6. Leave Management
7. Onboarding Tasks
8. Performance Evaluations
9. Incident Management
10. System Settings

### API Client (`lib/api.ts`)

**Configuration:**
- Base URL detection (environment-aware)
- Development: `http://localhost:5000/api`
- Production: Uses `NEXT_PUBLIC_API_URL` or relative paths
- Request interceptors: Adds JWT token from localStorage
- Response interceptors: Handles 401 (redirects to login)

**Features:**
- Automatic token injection
- Credential handling
- Error handling
- CORS support

### Pages Implementation

#### 1. **Dashboard** (`app/(main)/dashboard/page.tsx`)
- Real-time statistics display
- 6 metric cards:
  - Total Employees
  - Pending Approvals
  - License Expiries
  - Overdue Training
  - Incidents Requiring Review
  - Upcoming Shifts
- React Query for data fetching
- Loading and error states

#### 2. **Employee Management** (`app/(main)/employee-management/page.tsx`)
- Employee list with filters
- Create/Edit modals
- Department and role assignment
- Emergency contact management

#### 3. **License Tracking** (`app/(main)/license-tracking/page.tsx`)
- License list with expiry warnings
- Document upload
- Expiry date tracking
- Status management

#### 4. **Training & Compliance** (`app/(main)/training-compliance/page.tsx`)
- Training module list
- Employee training records
- Compliance tracking
- Policy acknowledgments

#### 5. **Shift Scheduling** (`app/(main)/shift-scheduling/page.tsx`)
- Calendar view
- Shift creation
- Employee assignment
- Conflict detection

#### 6. **Leave Management** (`app/(main)/leave-management/page.tsx`)
- Leave request list
- Request submission
- Approval workflow
- Status tracking

#### 7. **Onboarding Tasks** (`app/(main)/onboarding-tasks/page.tsx`)
- Task template management
- Employee onboarding progress
- Task assignment
- Completion tracking

#### 8. **Performance Evaluations** (`app/(main)/performance-evaluations/page.tsx`)
- Evaluation list
- Create evaluation form
- Rating system
- Goal tracking

#### 9. **Incident Management** (`app/(main)/incident-management/page.tsx`)
- Incident list
- Report incident form
- Severity and status management
- Corrective action tracking

#### 10. **System Settings** (`app/(main)/system-settings/page.tsx`)
- Sidebar theme customization
- Logo upload and management
- System configuration

### UI Components (ShadCN UI)

**Installed Components (21 total):**
- Button
- Card
- Input
- Form
- Table
- Dialog
- Dropdown Menu
- Select
- Toast
- Calendar
- Badge
- Tabs
- Label
- Textarea
- Checkbox
- Radio Group
- Switch
- Alert
- Avatar
- Separator
- Scroll Area

**Customization:**
- Emerald green primary color theme
- Consistent styling across components
- Dark mode support (ready)
- Responsive design

### State Management

**React Query (TanStack Query):**
- Server state management
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

**Local State:**
- React hooks (useState, useEffect)
- Form state (React Hook Form)

### Form Handling

**React Hook Form + Zod:**
- Type-safe form validation
- Schema-based validation
- Error handling
- Form state management
- Integration with ShadCN UI components

---

## Module Workflows

### 1. Employee Management Workflow

**Create Employee:**
1. User fills employee form (EmployeeModal)
2. Frontend validates data (Zod schema)
3. POST `/api/employees` with employee data
4. Backend hashes password (bcrypt)
5. Generates UUID for employee
6. Inserts into `employees` table
7. Returns success response
8. Frontend refreshes employee list

**Update Employee:**
1. User opens edit modal with existing data
2. Modifies fields
3. PUT `/api/employees/:id` with partial data
4. Backend updates only provided fields
5. Updates `updatedAt` timestamp
6. Returns success
7. Frontend updates cache

**Assign Roles:**
1. User selects roles for employee
2. POST `/api/employees/:id/roles` with roleIds array
3. Backend deletes existing role assignments
4. Inserts new role assignments
5. Returns success

### 2. License Tracking Workflow

**Add License:**
1. User opens LicenseModal
2. Fills license details (type, number, dates)
3. Optionally uploads document
4. POST `/api/upload` for document (if provided)
5. POST `/api/licenses` with license data + document URL
6. Backend creates license record
7. Checks expiry date (creates notification if < 90 days)
8. Returns success

**Expiry Alerts:**
1. Dashboard queries licenses expiring in 90 days
2. Displays count in dashboard
3. License list highlights expiring licenses
4. Notifications created automatically

### 3. Training & Compliance Workflow

**Assign Training:**
1. Admin selects training module
2. Assigns to employee(s)
3. Sets due date
4. POST `/api/training/assign`
5. Backend creates `employee_training_records`
6. Status set to "pending"
7. Notification created

**Complete Training:**
1. Employee marks training as complete
2. Optionally enters score
3. PUT `/api/training/:id/complete`
4. Backend updates status to "completed"
5. Sets `completedDate`
6. Checks if overdue (creates notification if so)

**Policy Acknowledgment:**
1. Employee views policy
2. Clicks "Acknowledge"
3. POST `/api/policies/:id/acknowledge`
4. Backend creates acknowledgment record
5. Logs IP address for compliance
6. Records timestamp

### 4. Shift Scheduling Workflow

**Create Shift:**
1. Admin opens shift creation form
2. Selects date, time, department
3. POST `/api/scheduling/shifts`
4. Backend creates shift record
5. Returns shift ID

**Assign Employee:**
1. Admin selects shift
2. Assigns employee(s)
3. POST `/api/scheduling/shifts/:id/assign`
4. Backend checks for conflicts:
   - Overlapping shifts
   - Leave requests
   - Maximum hours per day
5. Creates assignment if no conflicts
6. Returns success or conflict error

**View Schedule:**
1. Calendar view queries shifts for date range
2. GET `/api/scheduling/shifts?startDate=&endDate=`
3. Backend returns shifts with assignments
4. Frontend displays in calendar format

### 5. Leave Management Workflow

**Submit Leave Request:**
1. Employee opens leave request form
2. Selects type (PTO/sick/personal)
3. Enters date range
4. Provides reason
5. POST `/api/leave/requests`
6. Backend creates request with status "pending"
7. Notification sent to approver
8. Returns success

**Approve/Reject:**
1. Manager views pending requests
2. Reviews details
3. Approves or rejects
4. PUT `/api/leave/requests/:id/approve` or `/reject`
5. Backend updates status
6. Sets `approvedBy` and `approvedAt`
7. Notification sent to employee
8. If approved, checks for shift conflicts

### 6. Onboarding Workflow

**Start Onboarding:**
1. New employee created
2. Admin assigns onboarding tasks
3. POST `/api/onboarding/assign`
4. Backend creates `employee_onboarding_tasks` records
5. Status set to "pending"
6. Notifications created for each task

**Complete Task:**
1. Employee/Admin marks task complete
2. PUT `/api/onboarding/tasks/:id/complete`
3. Backend updates status to "completed"
4. Sets `completedDate`
5. Checks if all tasks complete (triggers completion notification)

### 7. Performance Evaluation Workflow

**Create Evaluation:**
1. Manager opens evaluation form
2. Selects employee and period
3. Enters ratings, goals, comments
4. POST `/api/evaluations`
5. Backend creates evaluation record
6. Stores goals as JSON
7. Returns success

**View Evaluations:**
1. Query evaluations by employee or period
2. GET `/api/evaluations?employeeId=&period=`
3. Backend returns evaluation history
4. Frontend displays in table or detail view

### 8. Incident Management Workflow

**Report Incident:**
1. User opens incident report form
2. Selects type (HIPAA/safety/other)
3. Enters details, severity
4. POST `/api/incidents`
5. Backend creates incident with status "open"
6. Notification sent to compliance team
7. Returns success

**Add Corrective Action:**
1. Manager reviews incident
2. Creates corrective action
3. POST `/api/incidents/:id/corrective-actions`
4. Backend creates action with due date
5. Status set to "pending"
6. Notification sent to assigned employee

**Resolve Incident:**
1. Manager marks incident resolved
2. Enters resolution notes
3. PUT `/api/incidents/:id/resolve`
4. Backend updates status to "resolved"
5. Sets `resolvedAt` timestamp
6. Closes related corrective actions if complete

### 9. Notification Workflow

**Create Notification:**
1. System event triggers notification
2. Backend creates notification record
3. Links to relevant page
4. Sets `isRead` to false

**Display Notifications:**
1. NotificationBell component queries unread
2. GET `/api/notifications/unread`
3. Displays count badge
4. Dropdown shows recent notifications

**Mark as Read:**
1. User clicks notification
2. PUT `/api/notifications/:id/read`
3. Backend updates `isRead` and `readAt`
4. Frontend updates UI

### 10. Settings & Customization Workflow

**Update Sidebar Theme:**
1. Admin opens System Settings
2. Customizes colors (background, text, active)
3. PUT `/api/settings/sidebar_theme`
4. Backend stores as JSON in `system_settings`
5. Frontend immediately applies theme
6. Theme persists across sessions

**Upload Logo:**
1. Admin uploads logo image
2. POST `/api/upload` (logo file)
3. Returns file URL
4. PUT `/api/settings/sidebar_logo` with URL
5. Backend stores URL
6. Navigation component loads logo
7. Logo persists across sessions

---

## API Endpoints

### Base URL
- Development: `http://localhost:5000/api`
- Production: Configured via `NEXT_PUBLIC_API_URL`

### Response Format
```json
{
  "success": true,
  "data": {...}
}
```

or

```json
{
  "success": false,
  "error": "Error message"
}
```

### Endpoint Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/employees` | List employees |
| GET | `/api/employees/:id` | Get employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| POST | `/api/employees/:id/roles` | Assign roles |
| GET | `/api/licenses` | List licenses |
| POST | `/api/licenses` | Create license |
| GET | `/api/training` | List trainings |
| POST | `/api/training/assign` | Assign training |
| GET | `/api/scheduling/shifts` | List shifts |
| POST | `/api/scheduling/shifts` | Create shift |
| GET | `/api/leave/requests` | List leave requests |
| POST | `/api/leave/requests` | Create leave request |
| GET | `/api/onboarding/tasks` | List onboarding tasks |
| GET | `/api/evaluations` | List evaluations |
| POST | `/api/evaluations` | Create evaluation |
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Report incident |
| GET | `/api/notifications/unread` | Get unread notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/upload` | Upload file |
| GET | `/api/settings/:key` | Get setting |
| PUT | `/api/settings/:key` | Update setting |

---

## Key Features & Functionalities

### 1. **Employee Lifecycle Management**
- Complete employee profile management
- Department assignment
- Role-based access control (ready)
- Emergency contact management
- Document storage
- Active/inactive status tracking

### 2. **License & Certification Tracking**
- Multiple license types per employee
- Expiry date tracking
- Automatic expiry alerts (90-day window)
- Document attachment
- License number validation
- Issuing organization tracking

### 3. **Training & Compliance**
- Training module library
- Employee training assignment
- Due date tracking
- Completion status (pending/completed/overdue)
- Score tracking
- Policy acknowledgment system
- IP address logging for compliance

### 4. **Shift Scheduling**
- Calendar-based scheduling
- Department-based shifts
- Employee shift assignment
- Conflict detection:
  - Overlapping shifts
  - Leave conflicts
  - Maximum hours per day
- Shift status management

### 5. **Leave Management**
- Multiple leave types (PTO/sick/personal)
- Date range selection
- Approval workflow
- Manager approval/rejection
- Status tracking
- Integration with scheduling

### 6. **Onboarding**
- Template-based onboarding tasks
- Employee-specific task assignment
- Progress tracking
- Task completion
- Required vs. optional tasks
- Assignment by HR/admin

### 7. **Performance Evaluations**
- Quarterly and annual evaluations
- Rating system
- Goal tracking (JSON storage)
- Strengths and improvements
- Evaluator assignment
- Historical evaluation records

### 8. **Incident Management**
- Multiple incident types (HIPAA/safety/other)
- Severity levels (low/medium/high/critical)
- Status workflow (open/in_progress/resolved/closed)
- Corrective action tracking
- Due date management
- Resolution notes

### 9. **Notifications System**
- Real-time notifications
- Unread count tracking
- Notification types
- Link to relevant pages
- Mark as read functionality
- Employee-specific notifications

### 10. **File Upload System**
- Secure file storage
- File type validation (images, PDFs, Word docs)
- File size limits (10MB)
- MIME type detection
- Static file serving
- CORS support for file access

### 11. **System Customization**
- Sidebar theme customization
- Logo upload and management
- Persistent settings (database-stored)
- Real-time theme application
- No flash on page refresh

### 12. **Dashboard Analytics**
- Real-time statistics
- Key metrics display
- Color-coded indicators
- Quick access to important data

---

## Security Implementation

### Backend Security

1. **Password Security:**
   - Bcrypt hashing (10 rounds)
   - No plain text passwords stored
   - Secure password generation

2. **SQL Injection Prevention:**
   - All queries use parameterized statements
   - No string concatenation in SQL
   - Input validation

3. **CORS Configuration:**
   - Whitelist-based origin control
   - Development-friendly (allows localhost variants)
   - Credential support

4. **Security Headers (Helmet):**
   - XSS protection
   - Content Security Policy
   - Frame options
   - MIME type sniffing prevention

5. **File Upload Security:**
   - File type validation
   - File size limits
   - Secure file storage
   - MIME type checking

6. **Input Validation:**
   - Zod schema validation (ready)
   - Type checking
   - Sanitization

### Frontend Security

1. **API Client:**
   - Token-based authentication (ready)
   - Automatic token injection
   - 401 handling (redirect to login)

2. **XSS Prevention:**
   - React's built-in XSS protection
   - No `dangerouslySetInnerHTML` (except controlled script)
   - Input sanitization

3. **CORS Handling:**
   - Credential support
   - Origin validation

### Authentication (Ready for Implementation)

**JWT Token Flow:**
1. User logs in
2. Backend validates credentials
3. Generates JWT token
4. Returns token to frontend
5. Frontend stores in localStorage
6. API client injects token in requests
7. Backend validates token (middleware needed)

**Role-Based Access Control:**
- Roles stored in database
- Permissions as JSON in roles table
- Middleware for route protection (to be implemented)

---

## File Upload System

### Backend Implementation

**Multer Configuration:**
- Storage: File system (`/uploads` directory)
- File size limit: 10MB
- File types: Images (jpeg, jpg, png, gif), PDFs, Word docs (doc, docx)

**Upload Endpoint:** `POST /api/upload`
- Accepts multipart/form-data
- Validates file type
- Validates file size
- Generates unique filename (timestamp + random)
- Stores in `/uploads` directory
- Returns file URL

**Static File Serving:**
- `/uploads` route serves files
- CORS headers configured
- Direct file access via URL

### Frontend Implementation

**File Upload Component:**
- Drag-and-drop support (ready)
- File selection
- Preview (for images)
- Progress indication
- Error handling

**Usage:**
- License document upload
- Logo upload (settings)
- Employee document upload

---

## Settings & Customization

### Sidebar Theme

**Storage:**
- Database: `system_settings` table
- Key: `sidebar_theme`
- Value: JSON object with colors

**Theme Properties:**
- `backgroundColor`: Sidebar background
- `textColor`: Default text color
- `activeColor`: Active item background
- `activeTextColor`: Active item text

**Implementation:**
- Blocking script in `layout.tsx` (prevents flash)
- Synchronous theme load on page refresh
- Real-time theme updates
- Persistent across sessions

### Sidebar Logo

**Storage:**
- Database: `system_settings` table
- Key: `sidebar_logo`
- Value: File URL (string)

**Implementation:**
- Logo upload via settings page
- File stored in `/uploads`
- URL stored in database
- Navigation component loads logo
- Fallback to text if logo fails

**Features:**
- Image preview
- Logo removal
- Automatic sizing
- Error handling

---

## Development Workflow

### Setup Process

1. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env` in both frontend and backend
   - Set database credentials
   - Set JWT secret
   - Configure API URLs

3. **Database Setup:**
   ```bash
   cd backend
   npm run db:migrate  # Create tables
   npm run db:seed     # Populate initial data
   ```

4. **Initialize ShadCN UI:**
   ```bash
   cd frontend
   npx shadcn@latest init
   npx shadcn@latest add [components]
   ```

5. **Start Development:**
   ```bash
   npm run dev  # Runs both frontend and backend
   ```

### Development Commands

**Root:**
- `npm run dev` - Start both servers
- `npm run build` - Build both projects
- `npm run install:all` - Install all dependencies

**Backend:**
- `npm run dev` - Start dev server (nodemon)
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

**Frontend:**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Code Organization

**Backend:**
- Routes: Feature-based route files
- Database: Direct SQL queries (no ORM)
- Middleware: Reusable middleware functions
- Types: TypeScript type definitions

**Frontend:**
- Pages: Next.js App Router pages
- Components: Reusable UI components
- Lib: Utility functions and API client
- Hooks: Custom React hooks (if needed)

### Best Practices Implemented

1. **TypeScript:** Full type safety
2. **Error Handling:** Consistent error responses
3. **Code Organization:** Modular structure
4. **Security:** SQL injection prevention, password hashing
5. **Performance:** Connection pooling, query optimization
6. **Documentation:** Comprehensive docs
7. **Environment Variables:** Configuration via .env
8. **Git Ignore:** Proper .gitignore rules

---

## Summary

The EmeraldRx HR Management System is a **production-ready foundation** with:

✅ **Complete Database Schema** - 21 tables covering all HR functions
✅ **Full Backend API** - 15+ route modules with CRUD operations
✅ **Modern Frontend** - Next.js 14 with TypeScript and ShadCN UI
✅ **10 Feature Modules** - All core HR functions implemented
✅ **File Upload System** - Secure document management
✅ **Notification System** - Real-time alerts
✅ **Customization** - Theme and logo management
✅ **Security** - Best practices implemented
✅ **Documentation** - Comprehensive guides

**Ready for:**
- Authentication implementation
- Role-based access control
- Email notifications
- Advanced reporting
- Production deployment

The system provides a solid foundation for a comprehensive HR management solution tailored for a regulated pharmacy environment.

