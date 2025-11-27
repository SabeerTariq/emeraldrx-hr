import { query, transaction } from "../config/database.js";
import bcrypt from "bcryptjs";

/**
 * Comprehensive Dummy Data Seed Script
 * Populates all modules with realistic dummy data for testing
 */
async function seedDummyData() {
  console.log("🌱 Starting comprehensive dummy data seed...");
  console.log("📡 Connecting to database...");

  try {
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

      // Helper to get random date in range
      const randomDate = (start: Date, end: Date): Date => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      };

      // Helper to format date for MySQL
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

      // Helper to format datetime for MySQL
      const formatDateTime = (date: Date): string => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const hashedPassword = await bcrypt.hash("Password123!", 10);

      // Get existing departments and employees
      const [existingDepts] = await connection.execute(
        `SELECT id, name FROM departments`
      ) as any[];
      
      const [existingEmployees] = await connection.execute(
        `SELECT id, employeeId, departmentId FROM employees WHERE isActive = 1`
      ) as any[];

      const [existingRoles] = await connection.execute(
        `SELECT id, name FROM roles`
      ) as any[];

      if (existingEmployees.length === 0) {
        console.log("⚠️  No employees found. Please run the main seed script first.");
        return;
      }

      const deptMap = new Map(existingDepts.map((d: any) => [d.name, d.id]));
      const employeeIds = existingEmployees.map((e: any) => e.id);
      const roleMap = new Map(existingRoles.map((r: any) => [r.name, r.id]));

      console.log(`📊 Found ${existingEmployees.length} employees, ${existingDepts.length} departments`);

      // ============================================
      // 1. LICENSES (Employee Licenses)
      // ============================================
      console.log("📜 Seeding employee licenses...");
      const licenseTypes = ["Pharmacy Technician", "Pharmacy Intern", "CPR Certification", "HIPAA Training", "State License"];
      const states = ["CA", "NY", "TX", "FL", "IL"];
      let licenseCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 2, 30); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const licenseType = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        const issueDate = randomDate(new Date(2020, 0, 1), new Date());
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);

        try {
          await connection.execute(
            `INSERT INTO licenses (id, employeeId, type, licenseNumber, state, issueDate, expiryDate, isActive, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              licenseType,
              `${state}-${Math.floor(Math.random() * 100000)}`,
              state,
              formatDate(issueDate),
              formatDate(expiryDate)
            ]
          );
          licenseCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${licenseCount} employee licenses`);

      // ============================================
      // 2. PHARMACY LICENSES
      // ============================================
      console.log("🏥 Seeding pharmacy licenses...");
      const pharmacyLicenseNames = [
        "State Pharmacy License",
        "DEA Registration",
        "Controlled Substance License",
        "Business License",
        "Compounding License"
      ];
      let pharmacyLicenseCount = 0;

      for (let i = 0; i < 10; i++) {
        const licenseName = pharmacyLicenseNames[Math.floor(Math.random() * pharmacyLicenseNames.length)];
        const issueDate = randomDate(new Date(2020, 0, 1), new Date());
        const expiryDate = new Date(issueDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        try {
          await connection.execute(
            `INSERT INTO pharmacy_licenses (id, licenseName, licenseNumber, state, issueDate, expirationDate, documentUrl, isActive, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
            [
              uuid(),
              licenseName,
              `PH-${Math.floor(Math.random() * 1000000)}`,
              states[Math.floor(Math.random() * states.length)],
              formatDate(issueDate),
              formatDate(expiryDate),
              `https://example.com/licenses/${uuid()}.pdf`
            ]
          );
          pharmacyLicenseCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${pharmacyLicenseCount} pharmacy licenses`);

      // ============================================
      // 3. TRAININGS
      // ============================================
      console.log("🎓 Seeding training courses...");
      const trainingCourses = [
        { title: "HIPAA Compliance Training", category: "Compliance", duration: 60, required: true },
        { title: "Pharmacy Safety Protocols", category: "Safety", duration: 120, required: true },
        { title: "Compounding Best Practices", category: "Technical", duration: 90, required: false },
        { title: "Customer Service Excellence", category: "Soft Skills", duration: 45, required: false },
        { title: "Medication Error Prevention", category: "Safety", duration: 75, required: true },
        { title: "OSHA Workplace Safety", category: "Safety", duration: 180, required: true },
        { title: "Pharmacy Law and Ethics", category: "Compliance", duration: 90, required: true },
        { title: "Inventory Management", category: "Operations", duration: 60, required: false }
      ];

      const trainingIds: string[] = [];
      for (const training of trainingCourses) {
        const id = uuid();
        trainingIds.push(id);
        try {
          await connection.execute(
            `INSERT INTO trainings (id, title, description, category, duration, isRequired, supportsVideo, supportsPDF, supportsQuiz, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, NOW(), NOW())`,
            [
              id,
              training.title,
              `Comprehensive training on ${training.title.toLowerCase()}`,
              training.category,
              training.duration,
              training.required ? 1 : 0
            ]
          );
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${trainingIds.length} training courses`);

      // ============================================
      // 4. EMPLOYEE TRAINING RECORDS
      // ============================================
      console.log("📚 Seeding employee training records...");
      const statuses = ["pending", "in_progress", "completed", "overdue"];
      let trainingRecordCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 3, 50); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const trainingId = trainingIds[Math.floor(Math.random() * trainingIds.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const assignedDate = randomDate(new Date(2023, 0, 1), new Date());
        const dueDate = new Date(assignedDate);
        dueDate.setDate(dueDate.getDate() + 30);
        
        const completedDate = status === "completed" 
          ? randomDate(assignedDate, new Date()) 
          : null;

        try {
          await connection.execute(
            `INSERT INTO employee_training_records (id, employeeId, trainingId, assignedDate, completedDate, dueDate, status, score, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              trainingId,
              formatDateTime(assignedDate),
              completedDate ? formatDateTime(completedDate) : null,
              formatDateTime(dueDate),
              status,
              status === "completed" ? Math.floor(Math.random() * 30) + 70 : null
            ]
          );
          trainingRecordCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${trainingRecordCount} training records`);

      // ============================================
      // 5. SHIFTS
      // ============================================
      console.log("📅 Seeding shifts...");
      const shiftTimes = [
        { start: "06:00", end: "14:00" },
        { start: "14:00", end: "22:00" },
        { start: "08:00", end: "16:00" },
        { start: "16:00", end: "00:00" }
      ];
      const shiftIds: string[] = [];
      let shiftCount = 0;

      // Create shifts for the next 30 days
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const shiftTime = shiftTimes[Math.floor(Math.random() * shiftTimes.length)];
        const deptId = Array.from(deptMap.values())[Math.floor(Math.random() * deptMap.size)];

        const startDateTime = new Date(`${formatDate(date)} ${shiftTime.start}:00`);
        const endDateTime = new Date(`${formatDate(date)} ${shiftTime.end}:00`);
        if (shiftTime.end === "00:00") {
          endDateTime.setDate(endDateTime.getDate() + 1);
        }

        const id = uuid();
        shiftIds.push(id);
        try {
          await connection.execute(
            `INSERT INTO shifts (id, date, startTime, endTime, departmentId, notes, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              id,
              formatDate(date),
              formatDateTime(startDateTime),
              formatDateTime(endDateTime),
              deptId,
              day % 7 === 0 ? "Weekend shift - reduced staffing" : null
            ]
          );
          shiftCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${shiftCount} shifts`);

      // ============================================
      // 6. SHIFT ASSIGNMENTS
      // ============================================
      console.log("👤 Seeding shift assignments...");
      let assignmentCount = 0;

      for (const shiftId of shiftIds.slice(0, Math.min(shiftIds.length, 50))) {
        const numAssignments = Math.floor(Math.random() * 3) + 1; // 1-3 employees per shift
        const assignedEmployees = new Set<string>();

        for (let i = 0; i < numAssignments; i++) {
          const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
          if (assignedEmployees.has(employeeId)) continue;
          assignedEmployees.add(employeeId);

          const clockIn = Math.random() > 0.3 ? randomDate(new Date(2024, 0, 1), new Date()) : null;
          const clockOut = clockIn ? new Date(clockIn.getTime() + 8 * 60 * 60 * 1000) : null;

          try {
            await connection.execute(
              `INSERT INTO shift_assignments (id, shiftId, employeeId, status, clockIn, clockOut, createdAt, updatedAt)
               VALUES (?, ?, ?, 'scheduled', ?, ?, NOW(), NOW())`,
              [
                uuid(),
                shiftId,
                employeeId,
                clockIn ? formatDateTime(clockIn) : null,
                clockOut ? formatDateTime(clockOut) : null
              ]
            );
            assignmentCount++;
          } catch (error: any) {
            // Skip duplicates
          }
        }
      }
      console.log(`  ✅ Created ${assignmentCount} shift assignments`);

      // ============================================
      // 7. ATTENDANCE LOGS
      // ============================================
      console.log("⏰ Seeding attendance logs...");
      let attendanceCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 10, 100); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const clockIn = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
        const clockOut = new Date(clockIn);
        clockOut.setHours(clockOut.getHours() + 8 + Math.floor(Math.random() * 2));
        
        const isLate = Math.random() > 0.8;
        const totalHours = 8 + (Math.random() * 0.5 - 0.25); // 7.75 to 8.25 hours

        try {
          await connection.execute(
            `INSERT INTO attendance_logs (id, employeeId, clockIn, clockOut, isLate, totalHours, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              formatDateTime(clockIn),
              formatDateTime(clockOut),
              isLate ? 1 : 0,
              totalHours.toFixed(2)
            ]
          );
          attendanceCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${attendanceCount} attendance logs`);

      // ============================================
      // 8. LEAVE REQUESTS
      // ============================================
      console.log("🏖️  Seeding leave requests...");
      const leaveTypes = ["Vacation", "Sick Leave", "Personal", "Family Emergency", "Bereavement"];
      const leaveStatuses = ["pending", "approved", "rejected"];
      let leaveCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 2, 30); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        const status = leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];
        const startDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 days

        try {
          const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          await connection.execute(
            `INSERT INTO leave_requests (id, employeeId, type, startDate, endDate, daysRequested, reason, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              leaveType,
              formatDate(startDate),
              formatDate(endDate),
              daysRequested,
              `Request for ${leaveType.toLowerCase()}`,
              status
            ]
          );
          leaveCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${leaveCount} leave requests`);

      // ============================================
      // 9. PTO BALANCES
      // ============================================
      console.log("💰 Seeding PTO balances...");
      const currentYear = new Date().getFullYear();
      let ptoCount = 0;

      for (const employeeId of employeeIds) {
        const totalPto = 80 + Math.floor(Math.random() * 40); // 80-120 hours
        const usedHours = Math.floor(Math.random() * totalPto * 0.6); // Up to 60% used
        const pendingHours = Math.floor(Math.random() * 20);
        const approvedHours = Math.floor(Math.random() * 10);
        const remainingBalance = totalPto - usedHours - pendingHours - approvedHours;

        try {
          await connection.execute(
            `INSERT INTO pto_balances (id, employeeId, year, totalPtoBalance, usedHours, pendingHours, approvedHours, remainingBalance, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE 
             totalPtoBalance = VALUES(totalPtoBalance),
             usedHours = VALUES(usedHours),
             remainingBalance = VALUES(remainingBalance)`,
            [
              uuid(),
              employeeId,
              currentYear,
              totalPto,
              usedHours,
              pendingHours,
              approvedHours,
              remainingBalance
            ]
          );
          ptoCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created/Updated ${ptoCount} PTO balances`);

      // ============================================
      // 10. DOCUMENTS
      // ============================================
      console.log("📄 Seeding employee documents...");
      const documentTypes = ["Resume", "ID", "Certificate", "License Copy", "Background Check"];
      let documentCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 2, 40); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        const uploadedBy = employeeIds[Math.floor(Math.random() * employeeIds.length)];

        try {
          await connection.execute(
            `INSERT INTO documents (id, employeeId, name, type, fileUrl, fileSize, mimeType, uploadedBy, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              `${docType} - ${new Date().getFullYear()}`,
              docType,
              `https://example.com/documents/${uuid()}.pdf`,
              Math.floor(Math.random() * 2000000) + 100000, // 100KB - 2MB
              "application/pdf",
              uploadedBy
            ]
          );
          documentCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${documentCount} documents`);

      // ============================================
      // 11. HR DOCUMENTS (Templates)
      // ============================================
      console.log("📋 Seeding HR document templates...");
      const hrDocTypes = ["W4 Form", "I9 Form", "Direct Deposit Form", "Emergency Contact Form", "Employee Handbook"];
      const hrDocIds: string[] = [];
      let hrDocCount = 0;

      for (const docType of hrDocTypes) {
        const id = uuid();
        hrDocIds.push(id);
        try {
          await connection.execute(
            `INSERT INTO hr_documents (id, title, description, documentType, documentUrl, isRequired, isActive, category, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
            [
              id,
              docType,
              `Official ${docType} template for new employees`,
              docType,
              `https://example.com/hr-docs/${docType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
              docType.includes("Form") ? 1 : 0,
              "Onboarding"
            ]
          );
          hrDocCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${hrDocCount} HR document templates`);

      // ============================================
      // 12. EMPLOYEE DOCUMENT UPLOADS
      // ============================================
      console.log("📤 Seeding employee document uploads...");
      const approvalStatuses = ["pending", "approved", "rejected"];
      let uploadCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * 2, 30); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const hrDocId = hrDocIds[Math.floor(Math.random() * hrDocIds.length)];
        const status = approvalStatuses[Math.floor(Math.random() * approvalStatuses.length)];

        try {
          const [hrDoc] = await connection.execute(
            `SELECT documentType FROM hr_documents WHERE id = ?`,
            [hrDocId]
          ) as any[];
          
          await connection.execute(
            `INSERT INTO employee_document_uploads (id, employeeId, hrDocumentId, documentName, documentType, fileUrl, fileSize, mimeType, approvalStatus, uploadedAt, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
            [
              uuid(),
              employeeId,
              hrDocId,
              hrDoc && hrDoc.length > 0 ? hrDoc[0].documentType : "Document",
              hrDoc && hrDoc.length > 0 ? hrDoc[0].documentType : "Other",
              `https://example.com/uploads/${uuid()}.pdf`,
              Math.floor(Math.random() * 2000000) + 100000,
              "application/pdf",
              status
            ]
          );
          uploadCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${uploadCount} employee document uploads`);

      // ============================================
      // 13. POLICIES
      // ============================================
      console.log("📜 Seeding policies...");
      const policyCategories = ["HR", "Safety", "Compliance", "Operations", "IT"];
      const policyTitles = [
        "Employee Code of Conduct",
        "Workplace Safety Policy",
        "Data Privacy Policy",
        "Drug-Free Workplace Policy",
        "Harassment Prevention Policy",
        "Remote Work Policy",
        "Dress Code Policy",
        "Social Media Policy"
      ];
      const policyIds: string[] = [];
      let policyCount = 0;

      for (const title of policyTitles) {
        const id = uuid();
        policyIds.push(id);
        const category = policyCategories[Math.floor(Math.random() * policyCategories.length)];
        
        try {
          await connection.execute(
            `INSERT INTO policies (id, title, description, category, documentUrl, version, isActive, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, '1.0', 1, NOW(), NOW())`,
            [
              id,
              title,
              `Official ${title.toLowerCase()} for all employees`,
              category,
              `https://example.com/policies/${title.toLowerCase().replace(/\s+/g, '-')}.pdf`
            ]
          );
          policyCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${policyCount} policies`);

      // ============================================
      // 14. EMPLOYEE POLICY ACKNOWLEDGMENTS
      // ============================================
      console.log("✅ Seeding policy acknowledgments...");
      let ackCount = 0;

      for (let i = 0; i < Math.min(employeeIds.length * policyIds.length * 0.5, 100); i++) {
        const employeeId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
        const policyId = policyIds[Math.floor(Math.random() * policyIds.length)];

        try {
          await connection.execute(
            `INSERT INTO employee_policy_acks (id, employeeId, policyId, acknowledgedAt, ipAddress, createdAt)
             VALUES (?, ?, ?, NOW(), ?, NOW())`,
            [
              uuid(),
              employeeId,
              policyId,
              `192.168.1.${Math.floor(Math.random() * 255)}`
            ]
          );
          ackCount++;
        } catch (error: any) {
          // Skip duplicates
        }
      }
      console.log(`  ✅ Created ${ackCount} policy acknowledgments`);

      // ============================================
      // 15. EMERGENCY CONTACTS
      // ============================================
      console.log("📞 Seeding emergency contacts...");
      const relationships = ["Spouse", "Parent", "Sibling", "Friend", "Other"];
      let contactCount = 0;

      for (const employeeId of employeeIds) {
        const numContacts = Math.floor(Math.random() * 2) + 1; // 1-2 contacts per employee

        for (let i = 0; i < numContacts; i++) {
          try {
            await connection.execute(
              `INSERT INTO emergency_contacts (id, employeeId, name, relationship, phone, email, isPrimary, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                uuid(),
                employeeId,
                `Contact ${i + 1} for Employee`,
                relationships[Math.floor(Math.random() * relationships.length)],
                `555-${Math.floor(Math.random() * 9000) + 1000}`,
                `contact${i + 1}@example.com`,
                i === 0 ? 1 : 0 // First contact is primary
              ]
            );
            contactCount++;
          } catch (error: any) {
            // Skip duplicates
          }
        }
      }
      console.log(`  ✅ Created ${contactCount} emergency contacts`);

      console.log("\n✅ Dummy data seeding completed successfully!");
      console.log("\n📊 Summary:");
      console.log(`  📜 Employee Licenses: ${licenseCount}`);
      console.log(`  🏥 Pharmacy Licenses: ${pharmacyLicenseCount}`);
      console.log(`  🎓 Training Courses: ${trainingIds.length}`);
      console.log(`  📚 Training Records: ${trainingRecordCount}`);
      console.log(`  📅 Shifts: ${shiftCount}`);
      console.log(`  👤 Shift Assignments: ${assignmentCount}`);
      console.log(`  ⏰ Attendance Logs: ${attendanceCount}`);
      console.log(`  🏖️  Leave Requests: ${leaveCount}`);
      console.log(`  💰 PTO Balances: ${ptoCount}`);
      console.log(`  📄 Documents: ${documentCount}`);
      console.log(`  📋 HR Documents: ${hrDocCount}`);
      console.log(`  📤 Document Uploads: ${uploadCount}`);
      console.log(`  📜 Policies: ${policyCount}`);
      console.log(`  ✅ Policy Acknowledgments: ${ackCount}`);
      console.log(`  📞 Emergency Contacts: ${contactCount}`);
    });

  } catch (error: any) {
    console.error("❌ Dummy data seeding failed:", error);
    process.exit(1);
  }
}

// Run if called directly
seedDummyData()
  .then(() => {
    console.log("✅ Dummy data seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Dummy data seeding failed:", error);
    process.exit(1);
  });

export { seedDummyData };

