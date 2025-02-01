import { pool } from "../../db/connectPostgres.js";

const getAllUsers = async (req, res) => {
  try {
    const query = `
          SELECT 
            u.id, 
            u.username, 
            u.full_name AS "fullName", 
            u.email, 
            u.bio, 
            u.link,
            u.phone_number, 
            u.business_type, 
            u.business_location, 
            u.is_admin, 
            u.created_at AS "createdAt", 
            u.updated_at AS "updatedAt",
            COALESCE(f.path, '') AS "profileImg",
            COALESCE(followers.follower_ids, '[]')::json AS followers,
            COALESCE(following.following_ids, '[]')::json AS following,
            COALESCE(liked.liked_posts, '[]')::json AS likedPosts
          FROM users u
          LEFT JOIN files f ON u.profile_img = f.id
          LEFT JOIN (
            SELECT following_id, json_agg(follower_id::TEXT) AS follower_ids
            FROM user_follows
            GROUP BY following_id
          ) followers ON u.id = followers.following_id
          LEFT JOIN (
            SELECT follower_id, json_agg(following_id::TEXT) AS following_ids
            FROM user_follows
            GROUP BY follower_id
          ) following ON u.id = following.follower_id
          LEFT JOIN (
            SELECT user_id, json_agg(post_id::TEXT) AS liked_posts
            FROM post_likes
            GROUP BY user_id
          ) liked ON u.id = liked.user_id
          ORDER BY RANDOM();
        `;

    const { rows } = await pool.query(query);

    const formattedUsers = rows.map((user) => ({
      id: user.id,
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phone_number || "",
      businessType: user.business_type || "",
      businessLocation: user.business_location || "",
      isAdmin: user.is_admin || "",
      followers: user.followers || [],
      following: user.following || [],
      profileImg: user.profileImg
        ? `http://localhost:8585/${user.profileImg}`
        : "",
      bio: user.bio || "",
      link: user.link || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      likedPosts: user.likedPosts || [],
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getAllUsers;
