import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    text TEXT,
    img_file_id INT REFERENCES files(id) ON DELETE SET NULL,
    link TEXT,
    created_at TIMESTAMP DEFAULT NOW()
    )`;

async function createAdsTable() {
  try {
    await pool.query(query);
    console.log("Ads table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createAdsTable;