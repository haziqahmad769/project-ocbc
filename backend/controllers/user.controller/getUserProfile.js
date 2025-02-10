import { pool } from "../../db/connectPostgres.js";

const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const query = `
        SELECT u.id AS user_id, u.username, u.full_name, u.email, u.bio, u.link, u.phone_number, u.business_type, u.business_location, u.is_admin,
             f.path AS profile_img,
             u.created_at, u.updated_at
      FROM users u
      LEFT JOIN files f ON u.profile_img = f.id
      WHERE u.username = $1
        `;

    const dbRes = await pool.query(query, [username]);
    const user = dbRes.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followersQuery = `
      SELECT follower_id FROM user_follows WHERE following_id = $1
    `;
    const followersResult = await pool.query(followersQuery, [user.user_id]);
    const followers = followersResult.rows.map((row) => row.follower_id);

    const followingQuery = `
    SELECT following_id FROM user_follows WHERE follower_id = $1
  `;
    const followingResult = await pool.query(followingQuery, [user.user_id]);
    const following = followingResult.rows.map((row) => row.following_id);

    const likedPostsQuery = `
      SELECT post_id FROM post_likes WHERE user_id = $1
    `;
    const likedPostsResult = await pool.query(likedPostsQuery, [user.user_id]);
    const likedPosts = likedPostsResult.rows.map((row) => row.post_id);

    const response = {
      id: user.user_id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      businessType: user.business_type,
      businessLocation: user.business_location,
      isAdmin: user.is_admin,
      followers: followers, // Array of user IDs
      following: following, // Array of user IDs
      profileImg: user.profile_img
        ? `${process.env.SERVER_URL}/${user.profile_img}`
        : null, // Full URL for profile image
      bio: user.bio,
      link: user.link,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      likedPosts: likedPosts, // Array of liked post IDs
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getUserProfile;
