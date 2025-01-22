import { pool } from "../../db/connectPostgres.js";

const getMe = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = `
      SELECT u.id, u.full_name, u.username, u.email, u.bio, u.link, 
             f.path AS profile_img, u.created_at, u.updated_at
      FROM users u
      LEFT JOIN files f ON u.profile_img = f.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.profile_img) {
      user.profile_img = `http://localhost:8585/${user.profile_img}`;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getMe;
