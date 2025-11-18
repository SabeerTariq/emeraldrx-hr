# Simple MySQL Setup Guide

This project uses **simple MySQL** with `mysql2` package - no ORM, just direct SQL queries.

## Database Connection

The database connection is configured via environment variables in `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=emeraldsrx_hrm
```

## Database Utilities

The project includes simple database utilities in `backend/src/config/database.ts`:

### Available Functions

- `query(sql, params)` - Execute a query and return results
- `queryOne(sql, params)` - Execute a query and return first result
- `getConnection()` - Get a connection from the pool
- `transaction(callback)` - Execute queries in a transaction
- `testConnection()` - Test database connection

### Example Usage

```typescript
import { query, queryOne, transaction } from "@/config/database";

// Simple query
const employees = await query("SELECT * FROM employees WHERE isActive = ?", [true]);

// Get one result
const employee = await queryOne("SELECT * FROM employees WHERE id = ?", [employeeId]);

// Transaction
await transaction(async (connection) => {
  await connection.execute("INSERT INTO employees ...");
  await connection.execute("INSERT INTO employee_roles ...");
});
```

## Database Schema

The complete database schema is defined in `backend/src/database/schema.sql`.

### Running Migrations

```bash
cd backend
npm run db:migrate
```

This will:
1. Read `backend/src/database/schema.sql`
2. Execute all CREATE TABLE statements
3. Create all indexes and foreign keys

### Seeding Data

```bash
cd backend
npm run db:seed
```

This will populate:
- Departments
- Roles
- Onboarding tasks
- Training modules

## Database Structure

All tables use:
- **VARCHAR(36)** for UUID primary keys
- **UTF8MB4** character set for full Unicode support
- **InnoDB** engine for foreign key support
- **Indexes** on frequently queried columns
- **Foreign keys** with CASCADE/SET NULL where appropriate

## Manual Database Operations

You can connect to MySQL directly:

```bash
mysql -u root -p emeraldsrx_hrm
```

Then run SQL commands:
```sql
SHOW TABLES;
DESCRIBE employees;
SELECT * FROM departments;
```

## Connection Pool

The database uses a connection pool with:
- **10 connections** maximum
- **Keep-alive** enabled
- **Automatic reconnection**

## Best Practices

1. **Always use parameterized queries** to prevent SQL injection:
   ```typescript
   // ✅ Good
   await query("SELECT * FROM employees WHERE id = ?", [id]);
   
   // ❌ Bad
   await query(`SELECT * FROM employees WHERE id = '${id}'`);
   ```

2. **Use transactions** for multiple related operations:
   ```typescript
   await transaction(async (connection) => {
     // Multiple queries here
   });
   ```

3. **Handle errors** properly:
   ```typescript
   try {
     const result = await query("SELECT * FROM employees");
   } catch (error) {
     console.error("Database error:", error);
   }
   ```

4. **Close connections** when done (pool handles this automatically)

## Troubleshooting

### Connection Refused
- Check MySQL is running: `sudo systemctl status mysql` (Linux) or Services (Windows)
- Verify credentials in `.env`
- Check firewall settings

### Access Denied
- Verify username and password
- Check user permissions:
  ```sql
  GRANT ALL PRIVILEGES ON emeraldsrx_hrm.* TO 'username'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Table Already Exists
- Migration script will skip existing tables
- To recreate: Drop database and run migrations again

## Next Steps

After setting up the database:
1. Run migrations: `npm run db:migrate`
2. Seed data: `npm run db:seed`
3. Start building your API endpoints using the database utilities

