import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * MySQL Database Connection Pool
 * Simple connection pool for MySQL database
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "emeraldsrx_hrm",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Get a connection from the pool
 */
export const getConnection = () => pool.getConnection();

/**
 * Execute a query
 */
export const query = async (sql: string, params?: any[]) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

/**
 * Execute a query and return the first result
 */
export const queryOne = async (sql: string, params?: any[]) => {
  const rows = await query(sql, params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
};

/**
 * Execute a transaction
 */
export const transaction = async (callback: (connection: mysql.PoolConnection) => Promise<any>) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    const [rows] = await pool.execute("SELECT 1 as test");
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};

/**
 * Close all connections
 */
export const closePool = async () => {
  await pool.end();
};

export default pool;
