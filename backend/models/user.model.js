import { pool } from "../db/connectPostgres.js";

// const query = `
// CREATE TABLE IF NOT EXISTS users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) UNIQUE NOT NULL,
//   full_name VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   business_location VARCHAR(255),
//   business_type VARCHAR(255),
//   phone_number VARCHAR(255),
//   link VARCHAR(255),
//   profile_img INTEGER REFERENCES files(id),
//   bio VARCHAR(255),
//   is_admin BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMP DEFAULT NOW(),
//   updated_at TIMESTAMP DEFAULT NOW()
// );
// `;

const query = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_img INT REFERENCES files(id),
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
