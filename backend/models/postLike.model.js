import { pool } from "../db/connectPostgres.js";

const query = `CREATE TABLE IF NOT EXISTS post_likes (
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
    )`;

async function createPostLikesTable() {
  try {
    await pool.query(query);
    console.log("Post likes table is created");
  } catch (error) {
    console.error(error);
  }
}

export default createPostLikesTable;
