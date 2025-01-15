import { pool } from "../../db/connectPostgres.js";

const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const postQuery = `
        SELECT * FROM posts WHERE id = $1
        `;
    const postResult = await pool.query(postQuery, [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const likeCheckQuery = `
        SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2
        `;

    const likeCheckResult = await pool.query(likeCheckQuery, [postId, userId]);
    const isLiked = likeCheckResult.rows.length > 0;

    if (isLiked) {
      const unlikeQuery = `
            DELETE FROM post_likes 
            WHERE post_id = $1 AND user_id = $2
            `;
      await pool.query(unlikeQuery, [postId, userId]);
      return res.status(200).json({
        message: "Post unliked",
      });
    } else {
      const likeInsertQuery = `
            INSERT INTO post_likes (post_id, user_id) 
            VALUES ($1, $2)
            `;

      await pool.query(likeInsertQuery, [postId, userId]);
      return res.status(200).json({
        message: "Post liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default likeUnlikePost;
