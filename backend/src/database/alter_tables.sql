-- ALTER TABLE statements for existing tables
-- Add missing fields to existing tables

-- Add role field to shifts table
ALTER TABLE shifts 
ADD COLUMN IF NOT EXISTS role VARCHAR(100) NULL AFTER departmentId,
ADD INDEX IF NOT EXISTS idx_role (role),
ADD INDEX IF NOT EXISTS idx_departmentId (departmentId);

-- Add missing fields to leave_requests table
ALTER TABLE leave_requests
ADD COLUMN IF NOT EXISTS daysRequested DECIMAL(5,2) NULL AFTER endDate,
ADD COLUMN IF NOT EXISTS managerComments TEXT NULL AFTER rejectionReason,
ADD INDEX IF NOT EXISTS idx_type (type);

-- Add missing fields to trainings table
ALTER TABLE trainings
ADD COLUMN IF NOT EXISTS supportsVideo BOOLEAN DEFAULT FALSE AFTER isRequired,
ADD COLUMN IF NOT EXISTS supportsPDF BOOLEAN DEFAULT FALSE AFTER supportsVideo,
ADD COLUMN IF NOT EXISTS supportsQuiz BOOLEAN DEFAULT FALSE AFTER supportsPDF;

-- Add certificateUrl to employee_training_records
ALTER TABLE employee_training_records
ADD COLUMN IF NOT EXISTS certificateUrl TEXT NULL AFTER score;

