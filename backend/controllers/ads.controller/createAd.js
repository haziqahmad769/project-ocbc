import { pool } from "../../db/connectPostgres.js";

const createAd = async (req, res) => {
  try {
    const text = req.body.text;
    const link = req.body.link;
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
    if (!text || !imgFileId || !link) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const adsInsertQuery = `
      INSERT INTO ads (text, img_file_id, link) 
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const result = await pool.query(adsInsertQuery, [text, imgFileId, link]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createAd;
