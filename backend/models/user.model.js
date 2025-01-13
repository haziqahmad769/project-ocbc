import { pool } from "../db/connectPostgres.js";

const query = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  link TEXT,
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
