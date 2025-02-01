import { pool } from "../../db/connectPostgres.js";

const getMe = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query = `
      SELECT u.id, u.username, u.full_name, u.email, u.bio, u.link, u.phone_number, u.business_type, u.business_location, u.is_admin, 
             f.path AS profile_img, 
             u.created_at, u.updated_at
      FROM users u
      LEFT JOIN files f ON u.profile_img = f.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if (user.profile_img) {
    //   user.profile_img = `http://localhost:8585/${user.profile_img}`;
    // }

    const followersQuery = `
      SELECT follower_id FROM user_follows WHERE following_id = $1
    `;
    const followersResult = await pool.query(followersQuery, [userId]);
    const followers = followersResult.rows.map((row) => row.follower_id);

    const followingQuery = `
      SELECT following_id FROM user_follows WHERE follower_id = $1
    `;
    const followingResult = await pool.query(followingQuery, [userId]);
    const following = followingResult.rows.map((row) => row.following_id);

    const likedPostsQuery = `
    SELECT post_id FROM post_likes WHERE user_id = $1
  `;
    const likedPostsResult = await pool.query(likedPostsQuery, [userId]);
    const likedPosts = likedPostsResult.rows.map((row) => row.post_id);

    // Construct the response
    const response = {
      id: user.id,
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
        ? `http://localhost:8585/${user.profile_img}`
        : null, // Full URL for profile image
      bio: user.bio,
      link: user.link,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      likedPosts: likedPosts, // Array of liked post IDs
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getMe;
