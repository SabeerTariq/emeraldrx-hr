-- EmeraldRx HR Management System Database Schema
-- MySQL Database Schema

-- ============================================
-- CORE TABLES
-- ============================================

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON DEFAULT (JSON_OBJECT()),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  dateOfBirth DATE,
  address TEXT,
  city VARCHAR(255),
  state VARCHAR(100),
  zipCode VARCHAR(20),
  hireDate DATE NOT NULL,
  terminationDate DATE,
  isActive BOOLEAN DEFAULT TRUE,
  departmentId VARCHAR(36),
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_employeeId (employeeId),
  INDEX idx_departmentId (departmentId),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Roles (Many-to-Many)
CREATE TABLE IF NOT EXISTS employee_roles (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  roleId VARCHAR(36) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_role (employeeId, roleId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_roleId (roleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  isPrimary BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- LICENSE & CERTIFICATION TABLES
-- ============================================

-- Licenses Table
CREATE TABLE IF NOT EXISTS licenses (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  type VARCHAR(255) NOT NULL,
  licenseNumber VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  issueDate DATE NOT NULL,
  expiryDate DATE NOT NULL,
  documentUrl TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_expiryDate (expiryDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  fileUrl TEXT NOT NULL,
  fileSize INT NOT NULL,
  mimeType VARCHAR(100),
  uploadedBy VARCHAR(36) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRAINING & COMPLIANCE TABLES
-- ============================================

-- Trainings Table
CREATE TABLE IF NOT EXISTS trainings (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  duration INT,
  isRequired BOOLEAN DEFAULT FALSE,
  supportsVideo BOOLEAN DEFAULT FALSE,
  supportsPDF BOOLEAN DEFAULT FALSE,
  supportsQuiz BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Training Records Table
CREATE TABLE IF NOT EXISTS employee_training_records (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  trainingId VARCHAR(36) NOT NULL,
  assignedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  completedDate DATETIME,
  dueDate DATETIME,
  status VARCHAR(50) DEFAULT 'pending',
  score INT,
  certificateUrl TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (trainingId) REFERENCES trainings(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_trainingId (trainingId),
  INDEX idx_status (status),
  INDEX idx_dueDate (dueDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Policies Table
CREATE TABLE IF NOT EXISTS policies (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  documentUrl TEXT,
  version VARCHAR(50) DEFAULT '1.0',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Policy Acknowledgments Table
CREATE TABLE IF NOT EXISTS employee_policy_acks (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  policyId VARCHAR(36) NOT NULL,
  acknowledgedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ipAddress VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (policyId) REFERENCES policies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_policy (employeeId, policyId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_policyId (policyId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SCHEDULING TABLES
-- ============================================

-- Shifts Table
CREATE TABLE IF NOT EXISTS shifts (
  id VARCHAR(36) PRIMARY KEY,
  date DATE NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  departmentId VARCHAR(36),
  role VARCHAR(100),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_departmentId (departmentId),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shift Assignments Table
CREATE TABLE IF NOT EXISTS shift_assignments (
  id VARCHAR(36) PRIMARY KEY,
  shiftId VARCHAR(36) NOT NULL,
  employeeId VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  clockIn DATETIME,
  clockOut DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (shiftId) REFERENCES shifts(id) ON DELETE CASCADE,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_shift_employee (shiftId, employeeId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_shiftId (shiftId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- LEAVE MANAGEMENT TABLES
-- ============================================

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  daysRequested DECIMAL(5,2),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approvedBy VARCHAR(36),
  approvedAt DATETIME,
  rejectionReason TEXT,
  managerComments TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_status (status),
  INDEX idx_startDate (startDate),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ONBOARDING TABLES
-- ============================================

-- Onboarding Tasks Table
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  isRequired BOOLEAN DEFAULT TRUE,
  `order` INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Onboarding Tasks Table
CREATE TABLE IF NOT EXISTS employee_onboarding_tasks (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  taskId VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  completedAt DATETIME,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (taskId) REFERENCES onboarding_tasks(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_task (employeeId, taskId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_taskId (taskId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PERFORMANCE EVALUATION TABLES
-- ============================================

-- Performance Evaluations Table
CREATE TABLE IF NOT EXISTS performance_evaluations (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  period VARCHAR(100) NOT NULL,
  evaluatorId VARCHAR(36) NOT NULL,
  ratings JSON DEFAULT (JSON_OBJECT()),
  goals JSON DEFAULT (JSON_ARRAY()),
  notes TEXT,
  documentUrl TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_period (period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INCIDENT MANAGEMENT TABLES
-- ============================================

-- Incidents Table
CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  employeeId VARCHAR(36),
  reportedBy VARCHAR(36) NOT NULL,
  severity VARCHAR(50) DEFAULT 'low',
  status VARCHAR(50) DEFAULT 'open',
  occurredAt DATETIME NOT NULL,
  reportedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolvedAt DATETIME,
  resolutionNotes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE SET NULL,
  INDEX idx_employeeId (employeeId),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Corrective Actions Table
CREATE TABLE IF NOT EXISTS corrective_actions (
  id VARCHAR(36) PRIMARY KEY,
  incidentId VARCHAR(36) NOT NULL,
  employeeId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  dueDate DATETIME NOT NULL,
  completedAt DATETIME,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (incidentId) REFERENCES incidents(id) ON DELETE CASCADE,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_incidentId (incidentId),
  INDEX idx_employeeId (employeeId),
  INDEX idx_status (status),
  INDEX idx_dueDate (dueDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SYSTEM SETTINGS TABLES
-- ============================================

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(36) PRIMARY KEY,
  settingKey VARCHAR(255) UNIQUE NOT NULL,
  settingValue JSON NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_settingKey (settingKey)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATION TABLES
-- ============================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  readAt DATETIME,
  link TEXT,
  metadata JSON DEFAULT (JSON_OBJECT()),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  INDEX idx_employeeId (employeeId),
  INDEX idx_isRead (isRead),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PHARMACY LICENSE TABLES
-- ============================================

-- Pharmacy Licenses Table
CREATE TABLE IF NOT EXISTS pharmacy_licenses (
  id VARCHAR(36) PRIMARY KEY,
  licenseName VARCHAR(255) NOT NULL,
  licenseNumber VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  issueDate DATE NOT NULL,
  expirationDate DATE NOT NULL,
  documentUrl TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_expirationDate (expirationDate),
  INDEX idx_isActive (isActive),
  INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ATTENDANCE TABLES
-- ============================================

-- Attendance Logs Table
CREATE TABLE IF NOT EXISTS attendance_logs (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  shiftAssignmentId VARCHAR(36),
  clockIn DATETIME NOT NULL,
  clockOut DATETIME,
  ipAddress VARCHAR(50),
  deviceInfo VARCHAR(255),
  isLate BOOLEAN DEFAULT FALSE,
  isNoShow BOOLEAN DEFAULT FALSE,
  totalHours DECIMAL(5,2),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (shiftAssignmentId) REFERENCES shift_assignments(id) ON DELETE SET NULL,
  INDEX idx_employeeId (employeeId),
  INDEX idx_clockIn (clockIn),
  INDEX idx_shiftAssignmentId (shiftAssignmentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clock-in Device Whitelist Table
CREATE TABLE IF NOT EXISTS clock_in_devices (
  id VARCHAR(36) PRIMARY KEY,
  deviceName VARCHAR(255) NOT NULL,
  ipAddress VARCHAR(50),
  deviceId VARCHAR(255),
  location VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ipAddress (ipAddress),
  INDEX idx_deviceId (deviceId),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PTO BALANCE TABLES
-- ============================================

-- PTO Balances Table
CREATE TABLE IF NOT EXISTS pto_balances (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  year INT NOT NULL,
  totalPtoBalance DECIMAL(6,2) DEFAULT 0.00,
  rolloverHours DECIMAL(6,2) DEFAULT 0.00,
  pendingHours DECIMAL(6,2) DEFAULT 0.00,
  approvedHours DECIMAL(6,2) DEFAULT 0.00,
  usedHours DECIMAL(6,2) DEFAULT 0.00,
  remainingBalance DECIMAL(6,2) DEFAULT 0.00,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_year (employeeId, year),
  INDEX idx_employeeId (employeeId),
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- HR DOCUMENT TABLES
-- ============================================

-- HR Documents Table (Templates provided by HR)
CREATE TABLE IF NOT EXISTS hr_documents (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  documentType VARCHAR(100) NOT NULL,
  documentUrl TEXT NOT NULL,
  isRequired BOOLEAN DEFAULT FALSE,
  isActive BOOLEAN DEFAULT TRUE,
  category VARCHAR(100),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_documentType (documentType),
  INDEX idx_category (category),
  INDEX idx_isActive (isActive)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee Document Uploads Table (with approval workflow)
CREATE TABLE IF NOT EXISTS employee_document_uploads (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  hrDocumentId VARCHAR(36),
  documentName VARCHAR(255) NOT NULL,
  documentType VARCHAR(100) NOT NULL,
  fileUrl TEXT NOT NULL,
  fileSize INT NOT NULL,
  mimeType VARCHAR(100),
  approvalStatus VARCHAR(50) DEFAULT 'pending',
  approvedBy VARCHAR(36),
  approvedAt DATETIME,
  rejectionReason TEXT,
  uploadedByEmployee BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (hrDocumentId) REFERENCES hr_documents(id) ON DELETE SET NULL,
  INDEX idx_employeeId (employeeId),
  INDEX idx_approvalStatus (approvalStatus),
  INDEX idx_hrDocumentId (hrDocumentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

