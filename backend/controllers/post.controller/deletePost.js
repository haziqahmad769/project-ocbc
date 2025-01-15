import { pool } from "../../db/connectPostgres.js";

const deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;

    const postQuery = `
    SELECT * FROM posts WHERE id = $1
    `;

    const postResult = await pool.query(postQuery, [postId]);

    const post = postResult.rows[0];

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }

    const deleteQuery = `
    DELETE FROM posts WHERE id = $1
    `;
    await pool.query(deleteQuery, [postId]);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deletePost;
