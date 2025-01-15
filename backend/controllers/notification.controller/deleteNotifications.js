import { pool } from "../../db/connectPostgres.js";

const deleteNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const deleteQuery = `
        DELETE FROM notifications
        WHERE to_user_id = $1
        `;

    await pool.query(deleteQuery, [userId]);

    res.status(200).json({
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteNotifications;
