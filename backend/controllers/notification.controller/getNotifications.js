import { pool } from "../../db/connectPostgres.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const notificationsQuery = `
        SELECT n.id, n.from_user_id, n.type, n.read, n.created_at, u.username, u.profile_img
        FROM notifications n
        JOIN users u ON n.from_user_id = u.id
        WHERE n.to_user_id = $1
        ORDER BY n.created_at DESC
        `;

    const notificationsResult = await pool.query(notificationsQuery, [userId]);

    const markAsReadQuery = `
        UPDATE notifications
        SET read = TRUE
        WHERE to_user_id = $1
        `;
    await pool.query(markAsReadQuery, [userId]);

    res.status(200).json(notificationsResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getNotifications;
