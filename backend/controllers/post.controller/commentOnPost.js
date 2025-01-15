import { pool } from "../../db/connectPostgres.js";

const commentOnPost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    const text = req.body.text;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    const postQuery = `
        SELECT * FROM posts WHERE id = $1
        `;
    const postResult = await pool.query(postQuery, [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const commentInsertQuery = `
    INSERT INTO comments (post_id, user_id, text)
    VALUES ($1, $2, $3)
    RETURNING id, post_id, user_id, text, created_at
    `;

    const commentResult = await pool.query(commentInsertQuery, [
      postId,
      userId,
      text,
    ]);

    res.status(201).json(commentResult.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default commentOnPost;
