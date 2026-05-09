import { getPool } from "../config/db.js";
import bangalorePincodes from "../data/pincodes.js";

// List all pincodes
export const getAll = async (page = 1, limit = 20) => {
  const pool = getPool();
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM pincodes ORDER BY pincode ASC LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ total }]] = await pool.query("SELECT COUNT(*) as total FROM pincodes");

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Search pincodes
export const search = async (query) => {
  const pool = getPool();
  const searchTerm = `%${query}%`;
  const [rows] = await pool.query(
    "SELECT * FROM pincodes WHERE pincode LIKE ? OR area_name LIKE ? ORDER BY pincode ASC",
    [searchTerm, searchTerm]
  );
  return rows;
};

// Get details by pincode
export const getByPincode = async (pincode) => {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM pincodes WHERE pincode = ?", [pincode]);
  return rows[0] || null;
};

// Get area pincodes
export const getByArea = async (area) => {
  const pool = getPool();
  const searchTerm = `%${area}%`;
  const [rows] = await pool.query(
    "SELECT * FROM pincodes WHERE area_name LIKE ? ORDER BY pincode ASC",
    [searchTerm]
  );
  return rows;
};

// Add new pincode
export const create = async (data) => {
  const pool = getPool();
  const [result] = await pool.query(
    "INSERT INTO pincodes (pincode, area_name, district, state) VALUES (?, ?, ?, ?)",
    [data.pincode, data.area_name, data.district || "Bangalore Urban", data.state || "Karnataka"]
  );
  return { id: result.insertId, ...data };
};

// Delete a pincode
export const remove = async (pincode) => {
  const pool = getPool();
  const [result] = await pool.query("DELETE FROM pincodes WHERE pincode = ?", [pincode]);
  return result.affectedRows > 0;
};

// Seed database
export const seedDatabase = async () => {
  const pool = getPool();
  const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM pincodes");

  if (count === 0) {
    console.log("Seeding database with pincodes...");
    const values = bangalorePincodes.map(p => [p.pincode, p.area_name, p.district, p.state]);
    await pool.query("INSERT IGNORE INTO pincodes (pincode, area_name, district, state) VALUES ?", [values]);
    console.log("Seeded pincodes successfully");
  }
  return true;
};
