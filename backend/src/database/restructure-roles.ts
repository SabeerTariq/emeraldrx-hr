import { transaction } from "../config/database.js";

/**
 * Restructure roles to Admin, HR, Employee
 * Add designation field and employee_permissions table
 */
async function restructureRoles() {
  console.log("🔄 Restructuring roles system...");
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

      // 1. Add designation column if it doesn't exist
      console.log("📝 Adding designation column to employees...");
      try {
        await connection.execute(`
          ALTER TABLE employees 
          ADD COLUMN designation VARCHAR(255) NULL AFTER departmentId
        `);
        console.log("  ✅ Added designation column");
      } catch (error: any) {
        if (error.code === 'ER_DUP_FIELDNAME' || error.message?.includes('Duplicate column')) {
          console.log("  ✓ Designation column already exists");
        } else {
          throw error;
        }
      }

      // 2. Create employee_permissions table
      console.log("📝 Creating employee_permissions table...");
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS employee_permissions (
            id VARCHAR(36) PRIMARY KEY,
            employeeId VARCHAR(36) NOT NULL,
            permissions JSON DEFAULT (JSON_OBJECT()),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE,
            UNIQUE KEY unique_employee_permissions (employeeId),
            INDEX idx_employeeId (employeeId)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log("  ✅ Created employee_permissions table");
      } catch (error: any) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message?.includes('already exists')) {
          console.log("  ✓ employee_permissions table already exists");
        } else {
          throw error;
        }
      }

      // 3. Create/Update roles to Admin, HR, Employee
      console.log("👥 Creating/updating roles (Admin, HR, Employee)...");
      const roleIds: { [key: string]: string } = {};
      
      const roles = [
        { 
          name: "Admin", 
          description: "Full system access. Can manage all employees, departments, roles, and permissions. Has complete CRUD access to all modules.", 
          permissions: JSON.stringify({ 
            employees: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            roles: ["create", "read", "update", "delete", "assign"],
            departments: ["create", "read", "update", "delete", "assign"],
            licenses: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            pharmacy_licenses: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            training: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            my_trainings: ["read"], // Separate module for employees to view their own trainings
            scheduling: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            leave: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            attendance: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            documents: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            policies: ["create", "read", "update", "delete", "assign", "approve", "reject"],
            settings: ["create", "read", "update", "delete", "assign"],
            dashboard: ["read"]
          }) 
        },
        { 
          name: "HR", 
          description: "HR operations. Can manage employees, view reports, and assign permissions.", 
          permissions: JSON.stringify({ 
            employees: ["create", "read", "update"],
            roles: ["read"],
            departments: ["read"],
            licenses: ["read", "update"],
            pharmacy_licenses: ["read"],
            training: ["create", "read", "update", "assign"],
            my_trainings: ["read"], // HR can also view their own trainings
            scheduling: ["read"],
            leave: ["read", "approve", "reject"],
            attendance: ["read"],
            documents: ["read", "approve", "reject"],
            policies: ["read", "update"],
            dashboard: ["read"]
          }) 
        },
        { 
          name: "Employee", 
          description: "Basic employee access. Can view own information, submit requests, and complete training.", 
          permissions: JSON.stringify({ 
            employees: ["read"],
            licenses: ["read"],
            my_trainings: ["read"], // Employees can view their own trainings
            scheduling: ["read"],
            leave: ["create", "read"],
            attendance: ["create", "read"],
            documents: ["read", "create"],
            policies: ["read"],
            dashboard: ["read"]
          }) 
        },
      ];

      for (const role of roles) {
        const [existingRows] = await connection.execute(
          `SELECT id FROM roles WHERE name = ?`,
          [role.name]
        ) as any[];
        
        if (existingRows && existingRows.length > 0 && existingRows[0].id) {
          roleIds[role.name] = existingRows[0].id;
          // Update existing role
          await connection.execute(
            `UPDATE roles SET description = ?, permissions = ?, updatedAt = NOW() WHERE id = ?`,
            [role.description, role.permissions, existingRows[0].id]
          );
          console.log(`  ✓ Updated role: ${role.name}`);
        } else {
          const id = uuid();
          roleIds[role.name] = id;
          await connection.execute(
            `INSERT INTO roles (id, name, description, permissions, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [id, role.name, role.description, role.permissions]
          );
          console.log(`  ✅ Added role: ${role.name}`);
        }
      }

      // 4. Update all employees to have "Employee" role by default
      console.log("👤 Updating employee role assignments...");
      const [allEmployees] = await connection.execute(
        `SELECT id FROM employees`
      ) as any[];
      
      // Remove all existing role assignments
      await connection.execute(`DELETE FROM employee_roles`);
      
      // Assign Employee role to all employees
      if (allEmployees && allEmployees.length > 0) {
        for (const emp of allEmployees) {
          await connection.execute(
            `INSERT INTO employee_roles (id, employeeId, roleId, createdAt) 
             VALUES (?, ?, ?, NOW())`,
            [uuid(), emp.id, roleIds["Employee"]]
          );
        }
        console.log(`  ✅ Assigned Employee role to ${allEmployees.length} employees`);
      }

      console.log("✅ Role restructuring completed successfully!");
    });

    console.log("\n📊 Summary:");
    console.log("  ✅ Added designation column to employees");
    console.log("  ✅ Created employee_permissions table");
    console.log("  ✅ Created/Updated roles: Admin, HR, Employee");
    console.log("  ✅ All employees assigned Employee role by default");
    console.log("\n💡 Next steps:");
    console.log("  - Assign Admin/HR roles to specific users via User Management");
    console.log("  - Set individual permissions per employee via Employee Management");
  } catch (error: any) {
    console.error("❌ Restructuring failed:", error);
    process.exit(1);
  }
}

// Run if called directly
restructureRoles()
  .then(() => {
    console.log("✅ Restructuring completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Restructuring failed:", error);
    process.exit(1);
  });

export { restructureRoles };

