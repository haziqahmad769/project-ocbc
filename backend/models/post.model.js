import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    img_file_id INT REFERENCES files(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`;

async function createPostsTable() {
  try {
    await pool.query(query);
    console.log("Posts table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createPostsTable;
