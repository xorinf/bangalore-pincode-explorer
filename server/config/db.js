import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;

// Connect to MySQL database
const connectDB = async () => {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bangalore_pincodes",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const tryConnect = async () => {
    try {
      // Test connection
      const connection = await pool.getConnection();
      console.log("MySQL connected successfully");
      connection.release();

      // Create table if not exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pincodes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          pincode VARCHAR(10) NOT NULL UNIQUE,
          area_name VARCHAR(100) NOT NULL,
          district VARCHAR(100) DEFAULT 'Bangalore Urban',
          state VARCHAR(50) DEFAULT 'Karnataka',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      return true;
    } catch (error) {
      console.error("MySQL connection failed. Retrying in 5 seconds...");
      return new Promise((resolve) => setTimeout(() => resolve(tryConnect()), 5000));
    }
  };

  return await tryConnect();
};

const getPool = () => pool;

export { connectDB, getPool };
