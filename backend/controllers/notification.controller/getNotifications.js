import { pool } from "../../db/connectPostgres.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notificationsQuery = `
        SELECT 
        n.id AS notification_id,
        n.type,
        n.read,
        n.created_at AS notification_created_at,
        n.updated_at AS notification_updated_at,
        n.to_user_id AS to_user_id,
        u.id AS from_user_id,
        u.username AS from_username,
        f.path AS from_profile_img
      FROM notifications n
      JOIN users u ON n.from_user_id = u.id
      LEFT JOIN files f ON u.profile_img = f.id
      WHERE n.to_user_id = $1
      ORDER BY n.created_at DESC;
        `;

    const notificationsResult = await pool.query(notificationsQuery, [userId]);

    const notifications = notificationsResult.rows.map((notification) => ({
      id: notification.notification_id,
      from: {
        id: notification.from_user_id,
        username: notification.from_username,
        profileImg: notification.from_profile_img
          ? `${process.env.SERVER_URL}/${notification.from_profile_img}`
          : null,
      },
      to: notification.to_user_id,
      type: notification.type,
      read: notification.read,
      createdAt: notification.notification_created_at,
      updatedAt: notification.notification_updated_at,
    }));

    const markAsReadQuery = `
        UPDATE notifications
        SET read = TRUE
        WHERE to_user_id = $1
        `;
    await pool.query(markAsReadQuery, [userId]);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getNotifications;
