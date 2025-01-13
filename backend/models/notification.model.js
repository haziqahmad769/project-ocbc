import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    from_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('follow', 'like')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`;

async function createNotificationsTable() {
  try {
    await pool.query(query);
    console.log("Notifications table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createNotificationsTable;
