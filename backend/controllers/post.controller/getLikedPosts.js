import { pool } from "../../db/connectPostgres.js";

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const likedPostQuery = `
        SELECT p.*, u.username, f.path AS img_path
        FROM post_likes pl
        JOIN posts p ON pl.post_id = p.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN files f ON p.img_file_id = f.id
        WHERE pl.user_id = $1
        ORDER BY p.created_at DESC
        `;

    const likedPostResult = await pool.query(likedPostQuery, [userId]);

    res.status(200).json(likedPostResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getLikedPosts;
