-- Update database with new role architecture
-- This script adds new roles and creates test users

-- First, add new departments if they don't exist
INSERT INTO departments (id, name, description, createdAt, updatedAt) 
VALUES 
  (UUID(), 'Compounding', 'Compounding department', NOW(), NOW()),
  (UUID(), 'Fulfillment', 'Fulfillment department', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Add new roles
INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt) 
VALUES 
  (
    UUID(), 
    'Admin', 
    'Super role with full system access. Manages roles, departments, employees, and all approvals.', 
    '{"employees":["create","read","update","delete"],"roles":["create","read","update","delete"],"departments":["create","read","update","delete"],"licenses":["create","read","update","delete"],"pharmacy_licenses":["create","read","update","delete"],"training":["create","read","update","delete","assign"],"scheduling":["create","read","update","delete"],"leave":["read","approve","reject"],"onboarding":["create","read","update","delete"],"evaluations":["create","read","update","delete"],"incidents":["create","read","update","delete"],"attendance":["read","update"],"documents":["read","approve","reject"],"policies":["create","read","update","delete"],"settings":["read","update"]}', 
    NOW(), 
    NOW()
  ),
  (
    UUID(), 
    'HR Manager', 
    'Focused on HR operations: employee onboarding, document management, PTO approval, training assignment.', 
    '{"employees":["read","update"],"licenses":["read","update"],"pharmacy_licenses":["read"],"training":["create","read","update","assign"],"scheduling":["read"],"leave":["read","approve","reject"],"onboarding":["create","read","update","delete"],"evaluations":["read","update"],"incidents":["read"],"attendance":["read"],"documents":["read","approve","reject"],"policies":["read","update"]}', 
    NOW(), 
    NOW()
  ),
  (
    UUID(), 
    'Lead Technician', 
    'Supervisor/manager for technical departments. Oversees department operations, approves department PTO, manages schedules.', 
    '{"employees":["read"],"licenses":["read"],"pharmacy_licenses":["read"],"training":["read","assign"],"scheduling":["create","read","update"],"leave":["read","approve","reject"],"onboarding":["read","update"],"evaluations":["read","update"],"incidents":["create","read","update"],"attendance":["read"],"documents":["read","approve"],"policies":["read"]}', 
    NOW(), 
    NOW()
  ),
  (
    UUID(), 
    'Compounding Technician', 
    'Employee role for Compounding department. Clock in/out, view schedules, submit PTO, complete training.', 
    '{"employees":["read"],"licenses":["read"],"training":["read"],"scheduling":["read"],"leave":["create","read"],"onboarding":["read"],"evaluations":["read"],"incidents":["create","read"],"attendance":["create","read"],"documents":["read","create"],"policies":["read"]}', 
    NOW(), 
    NOW()
  ),
  (
    UUID(), 
    'Fulfillment Technician', 
    'Employee role for Fulfillment department. Clock in/out, view schedules, submit PTO, complete training.', 
    '{"employees":["read"],"licenses":["read"],"training":["read"],"scheduling":["read"],"leave":["create","read"],"onboarding":["read"],"evaluations":["read"],"incidents":["create","read"],"attendance":["create","read"],"documents":["read","create"],"policies":["read"]}', 
    NOW(), 
    NOW()
  )
ON DUPLICATE KEY UPDATE name = name;

