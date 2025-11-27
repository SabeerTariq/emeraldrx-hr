-- Restructure to 3 roles: Admin, HR, Employee
-- Add designation field to employees
-- Add employee_permissions table for individual permissions

-- Add designation column to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS designation VARCHAR(255) NULL AFTER departmentId;

-- Create employee_permissions table for individual permissions
CREATE TABLE IF NOT EXISTS employee_permissions (
  id VARCHAR(36) PRIMARY KEY,
  employeeId VARCHAR(36) NOT NULL,
  permissions JSON DEFAULT (JSON_OBJECT()),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY unique_employee_permissions (employeeId),
  INDEX idx_employeeId (employeeId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

