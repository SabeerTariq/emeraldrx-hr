# HRM System Update – Implementation Checklist for Cursor AI
### Project: EmeraldRx HRM  
### Objective: Audit existing project, enhance existing features, and fully implement client-approved requirements.

---

# 🔍 1. Project Audit Task

Go through the entire existing project codebase and check for:

- Missing modules  
- Partially implemented features  
- Incorrect logic  
- Incomplete UI  
- Missing validations  
- Models missing fields  
- Incorrect relationships  
- Areas where UI needs ShadCN enhancement  
- Areas that require refactoring for scalability  

After reviewing, generate a **detailed checklist** of:
- What exists  
- What is missing  
- What must be improved  

Do **not** remove existing working code—only extend, improve, and stabilize.

---

# 🟦 2. Implement All Missing Client Requirements

Use the following final requirements provided by the client.

---

# ✅ **2.1 Licensing – Two Separate Modules**
### A. Employee License Tracking
- Track individual licenses (if any).  
- Fields: employee_id, license_type, license_number, expiration_date.  
- Alerts 30/60/90 days before expiry.

### B. Pharmacy License Tracking
- Track pharmacy-level operational licenses.  
- Fields: license_name, license_number, state, issue_date, expiration_date.  
- Add upload for license PDF.  
- Alert Krista + Admin on expiry.

---

# 🕒 **2.2 Attendance & Scheduling**
Implement or enhance the following:

### A. Clock-in System  
- The system must allow clock-in ONLY from a designated device (IP or device check).  
- Add a “Clock In / Clock Out” screen.  
- Log timestamps into an attendance table.

### B. Manager Review  
- Managers must be able to see:  
  - Late employees  
  - No-call/no-show  
  - Total hours  
  - Weekly summaries  

### C. Scheduling  
- Employees can have schedules assigned.  
- Schedules must support:  
  - Role per shift  
  - Department visibility  
  - Shift times  
- Employees can view:  
  - Their own shifts  
  - Their department’s shifts  

---

# 📅 **2.3 Leave Management (PTO, Sick, Vacation)**

### 1. Employees can:
- Submit new leave requests  
- View PTO balance  
- View pending, denied, approved requests  

### 2. Managers can:
- Approve / deny leave  
- Add comments  
- See leave calendar  

### 3. PTO Rules:
- PTO resets on January 1  
- Configurable rollover (default: 1 day = 8 hours)  
- Sick leave merged into PTO  

Add fields:
- total_ppto_balance  
- rollover_hours  
- pending_hours  
- approved_hours  

---

# 📄 **2.4 Employee Portal Enhancements**

Employees should see:

### A. Personal Info  
- Address  
- Emergency contact  
- Email  
- Phone  

### B. Documents  
- Signed documents (read-only)  
- Required-fill documents  
- Ability to upload documents  
- Admin must receive alerts for new uploads  

### C. Dashboard  
- Hours worked  
- Upcoming shifts  
- Pending approvals  
- Training status  
- PTO balance  

### D. Department Schedule View  
Employees should see schedules of:
- Their own department  
- Other related departments (ex: fulfillment ↔ shipping)

---

# 🎓 **2.5 Training Module**
Implement or enhance:

- Sexual Harassment  
- HIPAA  
- Pharmacy compliance trainings  
- Track completion dates  
- Upload training certificates  
- Admin assigns training tasks  
- Employees must see pending/completed trainings  
- Supports video / PDF / quiz if needed later  

---

# 🟨 **2.6 Document Management**
Add two sections:

### A. HR-Provided Documents  
- W4  
- Availability form  
- Direct Deposit form  
- Emergency contact form  
- Any HR template  

### B. Employee Uploads  
- Employee can upload but system must notify admin  
- Admin must approve/clean invalid uploads  

---

# 🔐 **2.7 Permissions (RBAC)**
Implement or verify:

- HR Admin  
- Compliance Manager  
- Pharmacy Manager  
- Department Manager  
- Employee  

Each role must have:
- Allowed routes  
- Allowed actions  
- Model-level restrictions  

---

# 🎛 **2.8 UI Enhancements Using ShadCN**
Review all UI pages and enhance with:
- ShadCN tables  
- Buttons  
- Modals  
- Alerts  
- Drawers  
- Cards  

Ensure:
- Consistent styles  
- Responsive layouts  
- Clean professional HR dashboard look  

---

# 🗂 **3. Database Updates**
Review migrations and ensure presence of:

### Tables:
- employees  
- employee_documents  
- pharmacy_licenses  
- employee_licenses  
- trainings  
- employee_training_records  
- pto_balances  
- leave_requests  
- schedules  
- schedule_assignments  
- attendance_logs  
- departments  
- roles  
- notifications  

Add missing tables or fields as needed.

---

# 🛠 4. Core Coding Tasks

### 1. Add any missing CRUD operations  
### 2. Add API endpoints where needed  
### 3. Add validation for all forms  
### 4. Add notification triggers  
### 5. Add dashboard widgets  
### 6. Add IP/device restriction for clock-in system  
### 7. Improve existing pages with ShadCN  

---

# 📤 5. Output Format Required From Cursor

Cursor should:

1. Generate a **project audit checklist**  
2. Generate a list of **new files to be created**  
3. Generate a list of **files to be modified**  
4. Begin implementing all missing features  
5. Ask for confirmation before major structural changes  
6. Use ShadCN for all UI components  
7. Keep code modular, clean, and documented  

---

# ✔ END OF FILE  
Save this file as `hrm_update_requirements.md` and follow all instructions when updating the HRM project.
