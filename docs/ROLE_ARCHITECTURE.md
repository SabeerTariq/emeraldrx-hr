# Role Architecture - EmeraldRx HRM

## Overview

The EmeraldRx HRM system uses a **multi-role assignment** architecture with **dynamic permissions** per role. This allows flexible access control where users can have multiple roles, and each role defines specific permissions for different modules.

## Core Principles

✨ **Multi-role assignment** - Users can have multiple roles simultaneously  
✨ **Dynamic permissions** - Each role defines granular permissions per module  
✨ **Admin creates roles** - Admins can create new roles anytime with custom permissions  

---

## System Roles

### 🟩 1. Admin (Super Role)

**Description:** Full system access. Manages roles, departments, employees, and all approvals.

**Core Responsibilities:**
- Create/Edit/Delete Roles
- Assign multiple roles to each user
- Define permissions per role
- Add/edit departments
- Add/edit employees
- Approve everything (PTO, documents, shifts)
- Configure PTO rules, shift rules, and training rules
- Full access to compliance, scheduling, attendance, and pharmacy licenses

**Permissions:**
- **employees:** create, read, update, delete
- **roles:** create, read, update, delete
- **departments:** create, read, update, delete
- **licenses:** create, read, update, delete
- **pharmacy_licenses:** create, read, update, delete
- **training:** create, read, update, delete, assign
- **scheduling:** create, read, update, delete
- **leave:** read, approve, reject
- **onboarding:** create, read, update, delete
- **evaluations:** create, read, update, delete
- **incidents:** create, read, update, delete
- **attendance:** read, update
- **documents:** read, approve, reject
- **policies:** create, read, update, delete
- **settings:** read, update

**Admin Dashboard Widgets:**
- All employees count
- Expiring employee licenses
- Expiring pharmacy licenses
- Pending PTO approvals
- Attendance today (late/absent/no show)
- Training overdue
- Recent employee uploads
- Pending onboarding tasks
- Department staffing coverage

---

### 🟦 2. HR Manager

**Description:** Focused on HR operations, not pharmacy operations.

**HR Manager Responsibilities:**
- Employee onboarding
- Document management
- PTO approval
- Employee profile updates
- Training assignment
- HR reports
- View all attendance
- View pharmacy licenses
- Track employee licenses

**Permissions:**
- **employees:** read, update
- **licenses:** read, update
- **pharmacy_licenses:** read
- **training:** create, read, update, assign
- **scheduling:** read
- **leave:** read, approve, reject
- **onboarding:** create, read, update, delete
- **evaluations:** read, update
- **incidents:** read
- **attendance:** read
- **documents:** read, approve, reject
- **policies:** read, update

**HR Manager Dashboard:**
- New employee documents
- Pending leave requests
- PTO balances
- Training progress
- Expiring employee licenses
- Recent attendance issues

---

### 🟧 3. Lead Technician

**Description:** Supervisor/manager hybrid for technical departments (Compounding or Fulfillment).

**Lead Technician Responsibilities:**
- Oversee Compounding or Fulfillment department
- Approve department PTO
- View department attendance
- Edit department schedules
- Approve shift swaps (if enabled)
- Ensure training is completed
- Sign off on SOP acknowledgment
- Review incidents related to their team

**Permissions:**
- **employees:** read
- **licenses:** read
- **pharmacy_licenses:** read
- **training:** read, assign
- **scheduling:** create, read, update
- **leave:** read, approve, reject
- **onboarding:** read, update
- **evaluations:** read, update
- **incidents:** create, read, update
- **attendance:** read
- **documents:** read, approve
- **policies:** read

**Lead Technician Dashboard:**
- Today's department attendance
- Department schedule
- Training overdue for team
- Pending PTO requests (department only)
- Incidents assigned to department

---

### 🟨 4. Compounding Technician (Employee Role)

**Description:** Employee role for Compounding department.

**Responsibilities:**
- Clock in/out (designated device only)
- View own schedule
- View department schedule
- View own documents
- Upload required documents
- Complete assigned training
- View hours worked
- Submit PTO requests
- See attendance history

**Permissions:**
- **employees:** read (own only)
- **licenses:** read (own only)
- **training:** read
- **scheduling:** read
- **leave:** create, read
- **onboarding:** read
- **evaluations:** read
- **incidents:** create, read
- **attendance:** create, read
- **documents:** read, create
- **policies:** read

**Dashboard:**
- Today's shift
- Hours worked this week
- Upcoming shifts
- PTO balance
- Required trainings
- New documents to sign

---

### 🟫 5. Fulfillment Technician (Employee Role)

**Description:** Employee role for Fulfillment department.

**Responsibilities:**
- Clock in/out
- View schedules
- Submit PTO requests
- View/edit personal info
- Training completion
- Document access & upload
- View worked hours

**Permissions:**
- **employees:** read (own only)
- **licenses:** read (own only)
- **training:** read
- **scheduling:** read
- **leave:** create, read
- **onboarding:** read
- **evaluations:** read
- **incidents:** create, read
- **attendance:** create, read
- **documents:** read, create
- **policies:** read

**Dashboard:**
- Today's fulfillment shift
- Hours worked
- PTO balance
- Training assignments
- Documents required

---

## Multi-Role Assignment

The system supports assigning **multiple roles** to a single user. When a user has multiple roles, they receive the **union of all permissions** from their assigned roles.

### Examples:

1. **Lead Technician + Fulfillment Technician**
   - User can manage department AND work as fulfillment tech
   - Gets permissions from both roles

2. **HR Manager + Lead Technician**
   - User can manage HR operations AND oversee a department
   - Gets permissions from both roles

3. **Admin + HR Manager**
   - User has full admin access AND HR-specific permissions
   - Gets permissions from both roles

4. **Compounding Technician + Fulfillment Technician**
   - User can work in both departments (rare but possible)
   - Gets permissions from both roles

---

## Permission Structure

Each role defines permissions as a JSON object where:
- **Key:** Module name (e.g., `employees`, `training`, `scheduling`)
- **Value:** Array of allowed actions (e.g., `["create", "read", "update", "delete"]`)

### Available Actions:
- `create` - Create new records
- `read` - View records
- `update` - Edit existing records
- `delete` - Delete records
- `assign` - Assign to others
- `approve` - Approve requests
- `reject` - Reject requests

### Available Modules:
- `employees` - Employee management
- `roles` - Role management
- `departments` - Department management
- `licenses` - Employee license tracking
- `pharmacy_licenses` - Pharmacy license tracking
- `training` - Training and compliance
- `scheduling` - Shift scheduling
- `leave` - Leave/PTO management
- `onboarding` - Onboarding tasks
- `evaluations` - Performance evaluations
- `incidents` - Incident management
- `attendance` - Attendance tracking
- `documents` - Document management
- `policies` - Policy management
- `settings` - System settings

---

## Permission Matrix

| Module / Feature | Admin | HR Manager | Lead Tech | Compounding Tech | Fulfillment Tech |
|------------------|-------|------------|-----------|------------------|------------------|
| Employee CRUD | ✔ | Limited | ✖ | ✖ | ✖ |
| Role Management | ✔ | ✖ | ✖ | ✖ | ✖ |
| Attendance Logs | ✔ | ✔ | Dept only | Self only | Self only |
| PTO Approval | ✔ | ✔ | Dept only | Submit | Submit |
| Schedule Management | ✔ | ✓ (optional) | Dept only | View | View |
| Shift Assignment | ✔ | ✖ | Dept only | ✖ | ✖ |
| Training Assignment | ✔ | ✔ | Dept only | Complete | Complete |
| Policy Acknowledgment Mgmt | ✔ | ✔ | Dept only | View/Sign | View/Sign |
| License Tracking | ✔ | ✔ | View only | View own | View own |
| Pharmacy License Tracking | ✔ | View only | View only | ✖ | ✖ |
| Document Upload Review | ✔ | ✔ | Dept only | Upload | Upload |

---

## Workflow Examples

### Example 1: PTO Request
1. Technician submits PTO
2. Department Manager (Lead Technician) reviews
3. HR Manager final approval if escalated
4. PTO balance updates
5. Employee sees updated balance

### Example 2: Training
1. HR assigns HIPAA + Harassment + SOP
2. Technician completes training
3. Lead Technician validates department-specific training
4. Compliance Manager verifies completion
5. System marks training complete

### Example 3: Attendance Review
1. Technician clocks in → locked to designated device
2. Attendance logged
3. Lead Technician sees late/missing staff
4. HR Manager reviews weekly report
5. Admin can override/correct entries

### Example 4: Document Upload
1. Employee uploads document
2. Admin + HR get instant notification
3. HR reviews & approves or rejects
4. Document added to profile

### Example 5: Pharmacy License Renewal
1. Admin uploads renewed license
2. Compliance Manager gets notified
3. System updates expiration countdown

---

## Managing Roles

### Creating a New Role

1. Navigate to **RBAC Management** page
2. Click **Create Role**
3. Enter role name and description
4. Select permissions for each module
5. Click **Create Role**

### Assigning Roles to Users

1. Navigate to **User Management** page
2. Click the **Shield** icon for the user
3. Check/uncheck roles to assign
4. Click **Update Roles**

### Multi-Role Assignment

Users can have multiple roles. When assigning:
- Select all roles that apply to the user
- System will combine permissions from all roles
- User gets access to all features from all assigned roles

---

## Default Seed Data

The system comes with pre-configured roles and sample employees:

**Roles:**
- Admin (1 user: Sarah Johnson)
- HR Manager (1 user: Michael Chen)
- Lead Technician (2 users: Emily Rodriguez, Lisa Anderson)
- Compounding Technician (3 users: David Thompson, Jessica Williams, James Wilson)
- Fulfillment Technician (3 users: Robert Martinez, Amanda Davis, Christopher Brown)

**Default Password:** `Password123!`

---

## Best Practices

1. **Principle of Least Privilege:** Only assign permissions that are necessary for the role
2. **Role Naming:** Use clear, descriptive role names
3. **Documentation:** Document custom roles and their purposes
4. **Regular Review:** Periodically review role assignments and permissions
5. **Multi-Role Use:** Use multi-role assignment for users who need cross-functional access

---

## Technical Implementation

- Roles stored in `roles` table with JSON permissions
- Employee-role relationships in `employee_roles` table (many-to-many)
- Permissions checked via middleware before route access
- Frontend RBAC page allows visual permission management
- User Management page supports multi-role assignment via checkboxes

---

## Support

For questions or issues with role management, contact your system administrator.

