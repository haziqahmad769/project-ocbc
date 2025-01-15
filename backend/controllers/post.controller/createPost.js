import { pool } from "../../db/connectPostgres.js";

const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const text = req.body.text;
    let imgFileId = null;

    if (req.file) {
      const file = req.file;

      const fileInsertQuery = `
            INSERT INTO files (fieldname, originalname, encoding, mimetype, destination, filename, path, size)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
            `;

      const fileResult = await pool.query(fileInsertQuery, [
        file.fieldname,
        file.originalname,
        file.encoding,
        file.mimetype,
        file.destination,
        file.filename,
        file.path,
        file.size,
      ]);

      imgFileId = fileResult.rows[0].id;
    }
    if (!text && !imgFileId) {
      return res.status(400).json({
        message: "Post must have test or an image",
      });
    }

    const postInsertQuery = `
    INSERT INTO posts (user_id, text, img_file_id)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, text, img_file_id, created_at
    `;

    const postResult = await pool.query(postInsertQuery, [
      userId,
      text,
      imgFileId,
    ]);

    res.status(201).json(postResult.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default createPost;
