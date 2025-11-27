import { query } from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ALTER TABLE Script
 * Adds missing fields to existing tables
 */
async function alterTables() {
  console.log("🔄 Starting table alterations...");

  try {
    // Add role to shifts
    try {
      await query(`
        ALTER TABLE shifts 
        ADD COLUMN role VARCHAR(100) NULL AFTER departmentId
      `);
      console.log("  ✓ Added 'role' field to shifts table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'role' field already exists in shifts table");
      } else {
        throw error;
      }
    }

    try {
      await query(`CREATE INDEX IF NOT EXISTS idx_role ON shifts(role)`);
      await query(`CREATE INDEX IF NOT EXISTS idx_departmentId ON shifts(departmentId)`);
    } catch (error: any) {
      // Index might already exist, continue
    }

    // Add fields to leave_requests
    try {
      await query(`
        ALTER TABLE leave_requests
        ADD COLUMN daysRequested DECIMAL(5,2) NULL AFTER endDate
      `);
      console.log("  ✓ Added 'daysRequested' field to leave_requests table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'daysRequested' field already exists in leave_requests table");
      } else {
        throw error;
      }
    }

    try {
      await query(`
        ALTER TABLE leave_requests
        ADD COLUMN managerComments TEXT NULL AFTER rejectionReason
      `);
      console.log("  ✓ Added 'managerComments' field to leave_requests table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'managerComments' field already exists in leave_requests table");
      } else {
        throw error;
      }
    }

    try {
      await query(`CREATE INDEX IF NOT EXISTS idx_type ON leave_requests(type)`);
    } catch (error: any) {
      // Index might already exist
    }

    // Add fields to trainings
    try {
      await query(`
        ALTER TABLE trainings
        ADD COLUMN supportsVideo BOOLEAN DEFAULT FALSE AFTER isRequired
      `);
      console.log("  ✓ Added 'supportsVideo' field to trainings table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'supportsVideo' field already exists in trainings table");
      }
    }

    try {
      await query(`
        ALTER TABLE trainings
        ADD COLUMN supportsPDF BOOLEAN DEFAULT FALSE AFTER supportsVideo
      `);
      console.log("  ✓ Added 'supportsPDF' field to trainings table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'supportsPDF' field already exists in trainings table");
      }
    }

    try {
      await query(`
        ALTER TABLE trainings
        ADD COLUMN supportsQuiz BOOLEAN DEFAULT FALSE AFTER supportsPDF
      `);
      console.log("  ✓ Added 'supportsQuiz' field to trainings table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'supportsQuiz' field already exists in trainings table");
      }
    }


    // Add certificateUrl to employee_training_records
    try {
      await query(`
        ALTER TABLE employee_training_records
        ADD COLUMN certificateUrl TEXT NULL AFTER score
      `);
      console.log("  ✓ Added 'certificateUrl' field to employee_training_records table");
    } catch (error: any) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("  ⚠ 'certificateUrl' field already exists in employee_training_records table");
      } else {
        throw error;
      }
    }

    console.log("✅ Table alterations completed successfully!");
  } catch (error) {
    console.error("❌ Alteration failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
    import.meta.url.endsWith('alter_tables.ts')) {
  alterTables()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { alterTables };

