import { pool } from "../../db/connectPostgres.js";

const followUnfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const userId = req.userId;

    if (userId === targetId) {
      return res.status(400).json({
        message: "You cannot follow/ unfollow yourself",
      });
    }

    const targetUserQuery = `
        SELECT id 
        FROM users 
        WHERE id = $1
        `;

    const targetUserResult = await pool.query(targetUserQuery, [targetId]);

    if (targetUserResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followCheckQuery = `
        SELECT * 
        FROM user_follows 
        WHERE follower_id = $1 AND following_id = $2
        `;

    const followCheckResult = await pool.query(followCheckQuery, [
      userId,
      targetId,
    ]);

    const isFollowing = followCheckResult.rows.length > 0;

    if (isFollowing) {
      const unfollowQuery = `
            DELETE FROM user_follows 
            WHERE follower_id = $1 AND following_id = $2
            `;

      await pool.query(unfollowQuery, [userId, targetId]);
      return res.status(200).json({
        message: " User unfollowed successfully",
      });
    } else {
      const followQuery = `
            INSERT INTO user_follows (follower_id, following_id)
            VALUES ($1, $2)
            `;

      await pool.query(followQuery, [userId, targetId]);

      const notificationInsertQuery = `
        INSERT INTO notifications (from_user_id, to_user_id, type, read)
        VALUES ($1, $2, 'follow', FALSE)
      `;
      await pool.query(notificationInsertQuery, [userId, targetId]);

      return res.status(200).json({
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default followUnfollowUser;
