# Test Users for Dashboard Testing

This document lists all test users created for testing each role's dashboard and permissions.

## Default Password

All test users use the same password: **`Password123!`**

---

## Test Users by Role

### 🔴 Admin (Super Role)

**Email:** `admin@emeraldsrx.com`  
**Employee ID:** `ADMIN001`  
**Department:** HR  
**Password:** `Password123!`

**Dashboard Features:**
- All employees count
- Expiring employee licenses
- Expiring pharmacy licenses
- Pending PTO approvals
- Attendance today (late/absent/no show)
- Training overdue
- Recent employee uploads
- Pending onboarding tasks
- Department staffing coverage

**Permissions:**
- Full system access
- Create/Edit/Delete Roles
- Manage all departments and employees
- Approve everything (PTO, documents, shifts)
- Configure system settings

---

### 🔵 HR Manager

**Email:** `hrmanager@emeraldsrx.com`  
**Employee ID:** `HRM001`  
**Department:** HR  
**Password:** `Password123!`

**Dashboard Features:**
- New employee documents
- Pending leave requests
- PTO balances
- Training progress
- Expiring employee licenses
- Recent attendance issues

**Permissions:**
- Employee onboarding
- Document management
- PTO approval
- Training assignment
- View all attendance
- View pharmacy licenses

---

### 🟢 Lead Technician (Compounding)

**Email:** `lead.compounding@emeraldsrx.com`  
**Employee ID:** `LEAD001`  
**Department:** Compounding  
**Password:** `Password123!`

**Dashboard Features:**
- Today's department attendance
- Department schedule
- Training overdue for team
- Pending PTO requests (department only)
- Incidents assigned to department

**Permissions:**
- Oversee Compounding department
- Approve department PTO
- View department attendance
- Edit department schedules
- Assign training to team
- Review department incidents

---

### 🟡 Lead Technician (Fulfillment)

**Email:** `lead.fulfillment@emeraldsrx.com`  
**Employee ID:** `LEAD002`  
**Department:** Fulfillment  
**Password:** `Password123!`

**Dashboard Features:**
- Today's department attendance
- Department schedule
- Training overdue for team
- Pending PTO requests (department only)
- Incidents assigned to department

**Permissions:**
- Oversee Fulfillment department
- Approve department PTO
- View department attendance
- Edit department schedules
- Assign training to team
- Review department incidents

---

### 🟣 Compounding Technician

**Email:** `compounding.tech@emeraldsrx.com`  
**Employee ID:** `COMP001`  
**Department:** Compounding  
**Password:** `Password123!`

**Dashboard Features:**
- Today's shift
- Hours worked this week
- Upcoming shifts
- PTO balance
- Required trainings
- New documents to sign

**Permissions:**
- Clock in/out (designated device only)
- View own schedule
- View department schedule
- View own documents
- Upload required documents
- Complete assigned training
- Submit PTO requests

**Additional Test Users:**
- `compounding.tech2@emeraldsrx.com` (COMP002)
- `compounding.tech3@emeraldsrx.com` (COMP003)

---

### 🟠 Fulfillment Technician

**Email:** `fulfillment.tech@emeraldsrx.com`  
**Employee ID:** `FULF001`  
**Department:** Fulfillment  
**Password:** `Password123!`

**Dashboard Features:**
- Today's fulfillment shift
- Hours worked
- PTO balance
- Training assignments
- Documents required

**Permissions:**
- Clock in/out
- View schedules
- Submit PTO requests
- View/edit personal info
- Training completion
- Document access & upload

**Additional Test Users:**
- `fulfillment.tech2@emeraldsrx.com` (FULF002)
- `fulfillment.tech3@emeraldsrx.com` (FULF003)

---

## Quick Login Reference

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@emeraldsrx.com` | `Password123!` |
| HR Manager | `hrmanager@emeraldsrx.com` | `Password123!` |
| Lead Tech (Compounding) | `lead.compounding@emeraldsrx.com` | `Password123!` |
| Lead Tech (Fulfillment) | `lead.fulfillment@emeraldsrx.com` | `Password123!` |
| Compounding Tech | `compounding.tech@emeraldsrx.com` | `Password123!` |
| Fulfillment Tech | `fulfillment.tech@emeraldsrx.com` | `Password123!` |

---

## Testing Scenarios

### 1. Admin Dashboard Test
1. Login as `admin@emeraldsrx.com`
2. Verify all dashboard widgets are visible
3. Test role management (create/edit/delete roles)
4. Test user management (assign roles, manage credentials)
5. Verify full access to all modules

### 2. HR Manager Dashboard Test
1. Login as `hrmanager@emeraldsrx.com`
2. Verify HR-focused dashboard widgets
3. Test PTO approval workflow
4. Test document management
5. Verify training assignment capabilities

### 3. Lead Technician Dashboard Test
1. Login as `lead.compounding@emeraldsrx.com`
2. Verify department-specific dashboard
3. Test department schedule management
4. Test department PTO approval
5. Verify department attendance view

### 4. Employee Dashboard Test
1. Login as `compounding.tech@emeraldsrx.com`
2. Verify employee dashboard widgets
3. Test clock in/out functionality
4. Test PTO request submission
5. Verify training completion

---

## Notes

- All users are active and ready for testing
- Each role has appropriate department assignments
- Multi-role assignment can be tested by assigning additional roles via User Management
- Password can be changed via User Management (Admin access required)

---

## Resetting Test Data

To reset test users and data:

```bash
cd backend
npm run db:seed
```

This will recreate all test users with default credentials.

