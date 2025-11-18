import { query } from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database Migration Script
 * Creates all necessary tables for the HRM system
 */
async function migrate() {
  console.log("🔄 Starting database migration...");

  try {
    // Read SQL migration file
    const migrationPath = path.join(__dirname, "schema.sql");
    
    if (!fs.existsSync(migrationPath)) {
      console.error("❌ schema.sql file not found at:", migrationPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, "utf-8");
    
    // Split by semicolon and execute each statement
    // Filter out comments and empty statements
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await query(statement);
          console.log(`  ✓ Statement ${i + 1}/${statements.length} executed`);
        } catch (error: any) {
          // Ignore "table already exists" errors
          if (error.code === "ER_TABLE_EXISTS_ERROR" || error.message?.includes("already exists")) {
            console.log(`  ⚠ Statement ${i + 1}/${statements.length} - Table already exists (skipped)`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log("✅ Database migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrate };

