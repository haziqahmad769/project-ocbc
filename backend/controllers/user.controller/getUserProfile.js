import { pool } from "../../db/connectPostgres.js";

const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const query = `
        SELECT id, full_name, username, email, bio, link, profile_img, created_at, updated_at
        FROM users
        WHERE username = $1
        `;

    const dbRes = await pool.query(query, [username]);
    const user = dbRes.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUserProfile;
