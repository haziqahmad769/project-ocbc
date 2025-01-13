import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`;

async function createCommentsTable() {
  try {
    await pool.query(query);
    console.log("Comments table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createCommentsTable;
