import { query, transaction } from "../config/database.js";
import bcrypt from "bcryptjs";

/**
 * Database Seed Script
 * Populates initial data with realistic dummy data for all tables
 */
async function seed() {
  console.log("🌱 Starting database seed...");
  console.log("📡 Connecting to database...");

  try {
    // Test connection first
    const { testConnection } = await import("../config/database.js");
    const connected = await testConnection();
    if (!connected) {
      throw new Error("Database connection failed");
    }

    await transaction(async (connection) => {
      console.log("✅ Database connection established");
      // Helper function to generate UUID
      const uuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Hash password for all users
      const hashedPassword = await bcrypt.hash("Password123!", 10);

      // 1. Seed Departments
      console.log("📁 Seeding departments...");
      const deptIds: { [key: string]: string } = {};
      
      const departments = [
        { name: "Pharmacy", description: "Pharmacy operations and compounding" },
        { name: "HR", description: "Human Resources" },
        { name: "Compliance", description: "Compliance and regulatory affairs" },
        { name: "Administration", description: "Administrative functions" },
      ];

      for (const dept of departments) {
        const id = uuid();
        deptIds[dept.name] = id;
        await connection.execute(
          `INSERT INTO departments (id, name, description, createdAt, updatedAt) 
           VALUES (?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE name = name`,
          [id, dept.name, dept.description]
        );
      }

      // 2. Seed Roles
      console.log("👥 Seeding roles...");
      const roleIds: { [key: string]: string } = {};
      
      const roles = [
        { name: "HR Admin", description: "Full HR system access", permissions: JSON.stringify({ employees: ["create", "read", "update", "delete"], licenses: ["create", "read", "update", "delete"], training: ["create", "read", "update", "delete", "assign"], scheduling: ["create", "read", "update", "delete"], leave: ["read", "approve", "reject"], onboarding: ["create", "read", "update", "delete"], evaluations: ["create", "read", "update", "delete"], incidents: ["create", "read", "update", "delete"] }) },
        { name: "Compliance Officer", description: "Compliance and training management", permissions: JSON.stringify({ employees: ["read"], licenses: ["create", "read", "update"], training: ["create", "read", "update", "delete", "assign"], scheduling: ["read"], leave: ["read"], onboarding: ["read", "update"], evaluations: ["read"], incidents: ["create", "read", "update"] }) },
        { name: "Pharmacy Manager", description: "Department management", permissions: JSON.stringify({ employees: ["read", "update"], licenses: ["read"], training: ["read", "assign"], scheduling: ["create", "read", "update", "delete"], leave: ["read", "approve", "reject"], onboarding: ["read", "update"], evaluations: ["create", "read", "update"], incidents: ["create", "read", "update"] }) },
        { name: "Department Manager", description: "Department-level management", permissions: JSON.stringify({ employees: ["read"], licenses: ["read"], training: ["read", "assign"], scheduling: ["create", "read", "update"], leave: ["read", "approve", "reject"], onboarding: ["read"], evaluations: ["create", "read", "update"], incidents: ["create", "read"] }) },
        { name: "Employee", description: "Self-service access", permissions: JSON.stringify({ employees: ["read"], licenses: ["read"], training: ["read"], scheduling: ["read"], leave: ["create", "read"], onboarding: ["read"], evaluations: ["read"], incidents: ["create", "read"] }) },
      ];

      for (const role of roles) {
        const id = uuid();
        roleIds[role.name] = id;
        await connection.execute(
          `INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE name = name`,
          [id, role.name, role.description, role.permissions]
        );
      }

      // 3. Seed Employees
      console.log("👤 Seeding employees...");
      const employeeIds: string[] = [];
      
      const employees = [
        { employeeId: "EMP001", firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@emeraldsrx.com", phone: "555-0101", department: "HR", role: "HR Admin", hireDate: "2020-01-15" },
        { employeeId: "EMP002", firstName: "Michael", lastName: "Chen", email: "michael.chen@emeraldsrx.com", phone: "555-0102", department: "Compliance", role: "Compliance Officer", hireDate: "2019-03-20" },
        { employeeId: "EMP003", firstName: "Emily", lastName: "Rodriguez", email: "emily.rodriguez@emeraldsrx.com", phone: "555-0103", department: "Pharmacy", role: "Pharmacy Manager", hireDate: "2018-06-10" },
        { employeeId: "EMP004", firstName: "David", lastName: "Thompson", email: "david.thompson@emeraldsrx.com", phone: "555-0104", department: "Pharmacy", role: "Department Manager", hireDate: "2021-02-14" },
        { employeeId: "EMP005", firstName: "Jessica", lastName: "Williams", email: "jessica.williams@emeraldsrx.com", phone: "555-0105", department: "Pharmacy", role: "Employee", hireDate: "2022-05-01" },
        { employeeId: "EMP006", firstName: "Robert", lastName: "Martinez", email: "robert.martinez@emeraldsrx.com", phone: "555-0106", department: "Pharmacy", role: "Employee", hireDate: "2022-07-15" },
        { employeeId: "EMP007", firstName: "Amanda", lastName: "Davis", email: "amanda.davis@emeraldsrx.com", phone: "555-0107", department: "Administration", role: "Department Manager", hireDate: "2020-09-01" },
        { employeeId: "EMP008", firstName: "James", lastName: "Wilson", email: "james.wilson@emeraldsrx.com", phone: "555-0108", department: "Pharmacy", role: "Employee", hireDate: "2023-01-10" },
        { employeeId: "EMP009", firstName: "Lisa", lastName: "Anderson", email: "lisa.anderson@emeraldsrx.com", phone: "555-0109", department: "Compliance", role: "Employee", hireDate: "2022-11-20" },
        { employeeId: "EMP010", firstName: "Christopher", lastName: "Brown", email: "christopher.brown@emeraldsrx.com", phone: "555-0110", department: "Pharmacy", role: "Employee", hireDate: "2023-03-05" },
      ];

      for (const emp of employees) {
        const id = uuid();
        employeeIds.push(id);
        await connection.execute(
          `INSERT INTO employees (id, employeeId, firstName, lastName, email, phone, hireDate, isActive, departmentId, password, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE email = email`,
          [id, emp.employeeId, emp.firstName, emp.lastName, emp.email, emp.phone, emp.hireDate, deptIds[emp.department], hashedPassword]
        );

        // Assign role to employee
        await connection.execute(
          `INSERT INTO employee_roles (id, employeeId, roleId, createdAt) 
           VALUES (?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE employeeId = employeeId`,
          [uuid(), id, roleIds[emp.role]]
        );
      }

      // 4. Seed Emergency Contacts
      console.log("📞 Seeding emergency contacts...");
      const contactNames = ["John Doe", "Jane Smith", "Robert Johnson", "Mary Williams", "William Brown"];
      for (let i = 0; i < employeeIds.length; i++) {
        await connection.execute(
          `INSERT INTO emergency_contacts (id, employeeId, name, relationship, phone, isPrimary, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [uuid(), employeeIds[i], contactNames[i % contactNames.length], i === 0 ? "Spouse" : "Parent", `555-${1000 + i}`, i === 0]
        );
      }

      // 5. Seed Licenses
      console.log("📜 Seeding licenses...");
      const licenseTypes = ["Pharmacist", "Pharmacy Technician", "Compounding Certificate"];
      const states = ["CA", "NY", "TX", "FL", "IL"];
      const today = new Date();
      
      for (let i = 0; i < employeeIds.length; i++) {
        const issueDate = new Date(today.getFullYear() - 2, i % 12, 15);
        const expiryDate = new Date(today.getFullYear() + 1, (i % 12), 15);
        
        await connection.execute(
          `INSERT INTO licenses (id, employeeId, type, licenseNumber, state, issueDate, expiryDate, isActive, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          [
            uuid(),
            employeeIds[i],
            licenseTypes[i % licenseTypes.length],
            `LIC-${states[i % states.length]}-${1000 + i}`,
            states[i % states.length],
            issueDate.toISOString().split('T')[0],
            expiryDate.toISOString().split('T')[0]
          ]
        );
      }

      // 6. Seed Trainings
      console.log("📚 Seeding trainings...");
      const trainingIds: string[] = [];
      
      const trainings = [
        { title: "HIPAA Compliance Training", description: "Comprehensive HIPAA compliance and patient privacy training", category: "HIPAA", duration: 60, isRequired: true },
        { title: "Compounding Safety", description: "Safety protocols for pharmaceutical compounding", category: "Safety", duration: 45, isRequired: true },
        { title: "Waste Management", description: "Proper handling and disposal of pharmaceutical waste", category: "Safety", duration: 30, isRequired: true },
        { title: "OSHA Workplace Safety", description: "Occupational safety and health administration training", category: "Safety", duration: 40, isRequired: false },
        { title: "Pharmaceutical Calculations", description: "Advanced pharmaceutical calculations and measurements", category: "Technical", duration: 90, isRequired: false },
      ];

      for (const training of trainings) {
        const id = uuid();
        trainingIds.push(id);
        await connection.execute(
          `INSERT INTO trainings (id, title, description, category, duration, isRequired, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE title = title`,
          [id, training.title, training.description, training.category, training.duration, training.isRequired]
        );
      }

      // 7. Seed Employee Training Records
      console.log("📋 Seeding employee training records...");
      for (let i = 0; i < employeeIds.length; i++) {
        for (let j = 0; j < trainingIds.length; j++) {
          const assignedDate = new Date(today.getFullYear() - 1, (i + j) % 12, 1);
          const dueDate = new Date(assignedDate.getFullYear(), assignedDate.getMonth() + 3, assignedDate.getDate());
          const completedDate = j < 3 ? new Date(assignedDate.getFullYear(), assignedDate.getMonth() + 1, assignedDate.getDate() + 5) : null;
          const status = completedDate ? "completed" : (dueDate < today ? "overdue" : "pending");
          const score = completedDate ? 85 + (i + j) % 15 : null;

          await connection.execute(
            `INSERT INTO employee_training_records (id, employeeId, trainingId, assignedDate, completedDate, dueDate, status, score, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              employeeIds[i],
              trainingIds[j],
              assignedDate.toISOString().split('T')[0],
              completedDate ? completedDate.toISOString().split('T')[0] : null,
              dueDate.toISOString().split('T')[0],
              status,
              score
            ]
          );
        }
      }

      // 8. Seed Policies
      console.log("📄 Seeding policies...");
      const policyIds: string[] = [];
      
      const policies = [
        { title: "HIPAA Privacy Policy", description: "Patient privacy and HIPAA compliance policy", category: "HIPAA", version: "2.1" },
        { title: "Compounding SOP", description: "Standard operating procedures for pharmaceutical compounding", category: "SOP", version: "1.5" },
        { title: "Safety Protocol", description: "Workplace safety and emergency procedures", category: "Safety", version: "3.0" },
        { title: "Employee Handbook", description: "Comprehensive employee handbook and guidelines", category: "HR", version: "2024.1" },
      ];

      for (const policy of policies) {
        const id = uuid();
        policyIds.push(id);
        await connection.execute(
          `INSERT INTO policies (id, title, description, category, version, isActive, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
           ON DUPLICATE KEY UPDATE title = title`,
          [id, policy.title, policy.description, policy.category, policy.version]
        );
      }

      // 9. Seed Policy Acknowledgments
      console.log("✅ Seeding policy acknowledgments...");
      for (let i = 0; i < employeeIds.length; i++) {
        for (let j = 0; j < policyIds.length; j++) {
          const acknowledgedDate = new Date(today.getFullYear() - 1, (i + j) % 12, 10);
          await connection.execute(
            `INSERT INTO employee_policy_acks (id, employeeId, policyId, acknowledgedAt, ipAddress, createdAt) 
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE employeeId = employeeId`,
            [uuid(), employeeIds[i], policyIds[j], acknowledgedDate.toISOString().split('T')[0], "192.168.1." + (100 + i)]
          );
        }
      }

      // 10. Seed Shifts
      console.log("📅 Seeding shifts...");
      const shiftIds: string[] = [];
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      for (let week = 0; week < 4; week++) {
        for (let day = 0; day < 7; day++) {
          const shiftDate = new Date(startOfWeek);
          shiftDate.setDate(startOfWeek.getDate() + (week * 7) + day);
          const startTime = new Date(shiftDate);
          startTime.setHours(8, 0, 0);
          const endTime = new Date(shiftDate);
          endTime.setHours(17, 0, 0);

          const id = uuid();
          shiftIds.push(id);
          await connection.execute(
            `INSERT INTO shifts (id, date, startTime, endTime, departmentId, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [id, shiftDate.toISOString().split('T')[0], startTime, endTime, deptIds["Pharmacy"]]
          );
        }
      }

      // 11. Seed Shift Assignments
      console.log("👷 Seeding shift assignments...");
      for (let i = 0; i < shiftIds.length; i++) {
        const employeeIndex = i % (employeeIds.length - 2); // Exclude HR and Compliance from shifts
        if (employeeIndex < 5) { // Only assign to pharmacy employees
          await connection.execute(
            `INSERT INTO shift_assignments (id, shiftId, employeeId, status, createdAt, updatedAt) 
             VALUES (?, ?, ?, 'scheduled', NOW(), NOW())
             ON DUPLICATE KEY UPDATE shiftId = shiftId`,
            [uuid(), shiftIds[i], employeeIds[employeeIndex + 3]] // Start from index 3 (pharmacy employees)
          );
        }
      }

      // 12. Seed Leave Requests
      console.log("🏖️ Seeding leave requests...");
      const leaveTypes = ["PTO", "Sick Leave", "Unpaid Leave"];
      for (let i = 0; i < employeeIds.length; i++) {
        const startDate = new Date(today.getFullYear(), (i % 12), 15);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (i % 5) + 1);
        const statuses = ["pending", "approved", "rejected"];
        const status = statuses[i % statuses.length];
        const approvedBy = status === "approved" ? employeeIds[0] : null;
        const approvedAt = status === "approved" ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 5) : null;

        await connection.execute(
          `INSERT INTO leave_requests (id, employeeId, type, startDate, endDate, reason, status, approvedBy, approvedAt, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            uuid(),
            employeeIds[i],
            leaveTypes[i % leaveTypes.length],
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            `Leave request for personal reasons`,
            status,
            approvedBy,
            approvedAt ? approvedAt.toISOString().split('T')[0] : null
          ]
        );
      }

      // 13. Seed Onboarding Tasks
      console.log("📋 Seeding onboarding tasks...");
      const onboardingTaskIds: string[] = [];
      
      const onboardingTasks = [
        { title: "Complete HIPAA Training", description: "Complete mandatory HIPAA compliance training", category: "Training", isRequired: true, order: 1 },
        { title: "Acknowledge SOPs", description: "Review and acknowledge all Standard Operating Procedures", category: "Documentation", isRequired: true, order: 2 },
        { title: "License Verification", description: "Submit and verify professional licenses", category: "Documentation", isRequired: true, order: 3 },
        { title: "System Access Setup", description: "Configure system access and credentials", category: "Access", isRequired: true, order: 4 },
      ];

      for (const task of onboardingTasks) {
        const id = uuid();
        onboardingTaskIds.push(id);
        await connection.execute(
          `INSERT INTO onboarding_tasks (id, title, description, category, isRequired, \`order\`, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE title = title`,
          [id, task.title, task.description, task.category, task.isRequired, task.order]
        );
      }

      // 14. Seed Employee Onboarding Tasks (for new employees)
      console.log("🎯 Seeding employee onboarding tasks...");
      const newEmployeeIds = employeeIds.slice(7); // Last 3 employees are newer
      for (const empId of newEmployeeIds) {
        for (let j = 0; j < onboardingTaskIds.length; j++) {
          const statuses = ["pending", "in_progress", "completed"];
          const status = statuses[j % statuses.length];
          const completedAt = status === "completed" ? new Date(today.getFullYear(), today.getMonth() - 1, 15 + j) : null;

          await connection.execute(
            `INSERT INTO employee_onboarding_tasks (id, employeeId, taskId, status, completedAt, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE employeeId = employeeId`,
            [uuid(), empId, onboardingTaskIds[j], status, completedAt ? completedAt.toISOString().split('T')[0] : null]
          );
        }
      }

      // 15. Seed Performance Evaluations
      console.log("📊 Seeding performance evaluations...");
      const periods = ["Q1 2024", "Q2 2024", "Q3 2024", "Annual 2023", "Q4 2023"];
      for (let i = 0; i < employeeIds.length; i++) {
        const period = periods[i % periods.length];
        const ratings = JSON.stringify({
          communication: 4 + (i % 2),
          teamwork: 4 + (i % 2),
          technical_skills: 4 + (i % 2),
          compliance: 5,
          overall: 4.2 + (i % 2) * 0.3
        });
        const goals = JSON.stringify([
          "Improve compounding accuracy",
          "Complete additional training modules",
          "Enhance patient communication"
        ]);

        await connection.execute(
          `INSERT INTO performance_evaluations (id, employeeId, period, evaluatorId, ratings, goals, notes, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            uuid(),
            employeeIds[i],
            period,
            employeeIds[0], // Evaluated by HR Admin
            ratings,
            goals,
            `Performance evaluation for ${period}. Employee shows strong commitment to compliance and safety.`
          ]
        );
      }

      // 16. Seed Incidents
      console.log("⚠️ Seeding incidents...");
      const incidentTypes = ["HIPAA", "Safety", "Medication Error"];
      const severities = ["low", "medium", "high"];
      const statuses = ["open", "in_progress", "closed"];
      
      for (let i = 0; i < 8; i++) {
        const occurredAt = new Date(today.getFullYear(), today.getMonth() - (i % 3), 15 + i);
        const reportedAt = new Date(occurredAt);
        reportedAt.setDate(occurredAt.getDate() + 1);
        const status = statuses[i % statuses.length];
        const resolvedAt = status === "closed" ? new Date(reportedAt.getFullYear(), reportedAt.getMonth(), reportedAt.getDate() + 5) : null;

        const incidentId = uuid();
        await connection.execute(
          `INSERT INTO incidents (id, type, title, description, employeeId, reportedBy, severity, status, occurredAt, reportedAt, resolvedAt, resolutionNotes, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            incidentId,
            incidentTypes[i % incidentTypes.length],
            `Incident ${i + 1}: ${incidentTypes[i % incidentTypes.length]} Issue`,
            `Description of ${incidentTypes[i % incidentTypes.length].toLowerCase()} incident that occurred.`,
            employeeIds[(i % employeeIds.length) + 2],
            employeeIds[i % employeeIds.length],
            severities[i % severities.length],
            status,
            occurredAt.toISOString().split('T')[0],
            reportedAt.toISOString().split('T')[0],
            resolvedAt ? resolvedAt.toISOString().split('T')[0] : null,
            status === "closed" ? "Issue resolved with corrective action implemented." : null
          ]
        );

        // Seed Corrective Actions for some incidents
        if (i < 5) {
          const dueDate = new Date(today);
          dueDate.setDate(today.getDate() + 30);
          const actionStatus = i < 2 ? "completed" : "pending";
          const completedAt = actionStatus === "completed" ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5) : null;

          await connection.execute(
            `INSERT INTO corrective_actions (id, incidentId, employeeId, title, description, dueDate, completedAt, status, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              incidentId,
              employeeIds[(i % employeeIds.length) + 2],
              `Corrective Action for Incident ${i + 1}`,
              `Required corrective action to address the incident.`,
              dueDate.toISOString().split('T')[0],
              completedAt ? completedAt.toISOString().split('T')[0] : null,
              actionStatus
            ]
          );
        }
      }

      // 17. Seed Notifications
      console.log("🔔 Seeding notifications...");
      const notificationTypes = ["license_expiry", "training_due", "leave_approval", "incident_review", "onboarding_task"];
      const notificationTitles = [
        "License Expiring Soon",
        "Training Due",
        "Leave Request Approved",
        "Incident Requires Review",
        "Onboarding Task Pending"
      ];
      const notificationMessages = [
        "Your license will expire in 30 days",
        "You have a training module due soon",
        "Your leave request has been approved",
        "An incident requires your review",
        "You have pending onboarding tasks"
      ];

      for (let i = 0; i < employeeIds.length; i++) {
        for (let j = 0; j < 3; j++) {
          const isRead = j === 0;
          const readAt = isRead ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - j) : null;
          const typeIndex = (i + j) % notificationTypes.length;

          await connection.execute(
            `INSERT INTO notifications (id, employeeId, type, title, message, isRead, readAt, link, metadata, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              uuid(),
              employeeIds[i],
              notificationTypes[typeIndex],
              notificationTitles[typeIndex],
              notificationMessages[typeIndex],
              isRead ? 1 : 0,
              readAt ? readAt.toISOString().split('T')[0] : null,
              `/dashboard`,
              JSON.stringify({ priority: j === 0 ? "high" : "normal" })
            ]
          );
        }
      }

      console.log("✅ Database seed completed successfully!");
    });

    console.log("\n📊 Summary:");
    console.log("  - Departments: 4");
    console.log("  - Roles: 5");
    console.log("  - Employees: 10");
    console.log("  - Licenses: 10");
    console.log("  - Trainings: 5");
    console.log("  - Training Records: 50");
    console.log("  - Policies: 4");
    console.log("  - Policy Acknowledgments: 40");
    console.log("  - Shifts: 28");
    console.log("  - Shift Assignments: 28");
    console.log("  - Leave Requests: 10");
    console.log("  - Onboarding Tasks: 4");
    console.log("  - Employee Onboarding Tasks: 12");
    console.log("  - Performance Evaluations: 10");
    console.log("  - Incidents: 8");
    console.log("  - Corrective Actions: 5");
    console.log("  - Notifications: 30");
    console.log("\n🎉 All dummy data has been populated!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
