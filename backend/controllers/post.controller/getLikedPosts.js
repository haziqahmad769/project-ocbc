import { pool } from "../../db/connectPostgres.js";

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const userQuery = `
    SELECT u.id AS user_id, u.username, u.full_name, u.email, u.bio, u.link,
           u.created_at AS user_created_at, u.updated_at AS user_updated_at,
           f.path AS profile_img
    FROM users u
    LEFT JOIN files f ON u.profile_img = f.id
    WHERE u.id = $1
  `;

    const userResult = await pool.query(userQuery, [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPostQuery = `
        SELECT 
        p.id AS post_id, 
        p.text, 
        p.created_at AS post_created_at, 
        p.updated_at AS post_updated_at,
        imgf.path AS post_img,
        u.id AS post_user_id,
        u.username AS post_user_username,
        u.full_name AS post_user_full_name,
        COALESCE(likes.like_user_ids, '[]')::json AS likes,
        COALESCE(comments.comment_data, '[]')::json AS comments
      FROM post_likes pl
      JOIN posts p ON pl.post_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN files imgf ON p.img_file_id = imgf.id
      LEFT JOIN (
        SELECT 
          post_id, 
          json_agg(user_id) AS like_user_ids
        FROM post_likes
        GROUP BY post_id
      ) likes ON p.id = likes.post_id
      LEFT JOIN (
        SELECT 
          c.post_id,
          json_agg(json_build_object(
            'id', c.id,
            'text', c.text,
            'user', json_build_object(
              'id', u.id,
              'username', u.username,
              'fullName', u.full_name,
              'email', u.email,
              'profileImg', f.path,
              'bio', u.bio,
              'link', u.link,
              'createdAt', u.created_at,
              'updatedAt', u.updated_at
            )
          )) AS comment_data
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN files f ON u.profile_img = f.id
        GROUP BY c.post_id
      ) comments ON p.id = comments.post_id
      WHERE pl.user_id = $1
      ORDER BY p.created_at DESC;
        `;

    const likedPostsResult = await pool.query(likedPostQuery, [userId]);

    const likedPosts = likedPostsResult.rows.map((post) => ({
      id: post.post_id,
      user: {
        id: post.post_user_id,
        username: post.post_user_username,
        fullName: post.post_user_full_name,
        profileImg: post.post_img
          ? `http://localhost:8585/${post.post_img}`
          : null,
      },
      text: post.text,
      img: post.post_img ? `http://localhost:8585/${post.post_img}` : null,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
    }));

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getLikedPosts;
