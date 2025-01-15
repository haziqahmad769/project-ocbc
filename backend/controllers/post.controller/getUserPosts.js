import { pool } from "../../db/connectPostgres.js";

const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;

    const userQuery = `
        SELECT id 
        FROM users 
        WHERE username = $1
        `;

    const userResult = await pool.query(userQuery, [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userPostsQuery = `
        SELECT p.*, f.path AS img_path
        FROM posts p
        LEFT JOIN files f ON p.img_file_id = f.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
        `;
    const postResult = await pool.query(userPostsQuery, [user.id]);

    res.status(200).json(postResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getUserPosts;
