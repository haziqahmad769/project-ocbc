import { pool } from "../db/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(255),
  business_type VARCHAR(255),
  business_location VARCHAR(255),
  bio TEXT,
  link TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  profile_img INT REFERENCES files(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`;

async function createUsersTable() {
  try {
    await pool.query(query);
    console.log("Users table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createUsersTable;
