import { pool } from "../../db/connectPostgres.js";

const getAllPosts = async (req, res) => {
  try {
    const postsQuery = `
    SELECT p.*, u.username, f.path AS img_path
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN files f ON p.img_file_id = f.id
    ORDER BY p.created_at DESC
    `;

    const postsResult = await pool.query(postsQuery);

    res.status(200).json(postsResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllPosts;
