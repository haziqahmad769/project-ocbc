import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS user_follows (
    follower_id INT REFERENCES users(id) ON DELETE CASCADE,
    following_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT check_not_self_follow CHECK (follower_id <> following_id)
    )`;

async function createUserFollowsTable() {
  try {
    await pool.query(query);
    console.log("User follows table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createUserFollowsTable;
