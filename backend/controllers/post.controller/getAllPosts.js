import { pool } from "../../db/connectPostgres.js";

const getAllPosts = async (req, res) => {
  try {
    const postsQuery = `
     SELECT 
        p.id AS post_id, 
        p.text, 
        p.created_at AS post_created_at, 
        p.updated_at AS post_updated_at,
        u.id AS user_id,
        u.username,
        u.full_name,
        u.email,
        u.bio,
        u.link,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at,
        f.path AS profile_img,
        imgf.path AS post_img,
        COALESCE(likes.like_user_ids, '[]')::json AS likes,
        COALESCE(comments.comment_data, '[]')::json AS comments
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN files f ON u.profile_img = f.id
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
              'followers', COALESCE(followers.follower_ids, '[]')::json,
              'following', COALESCE(following.following_ids, '[]')::json,
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
        LEFT JOIN (
          SELECT follower_id, json_agg(following_id) AS following_ids
          FROM user_follows
          GROUP BY follower_id
        ) following ON u.id = following.follower_id
        LEFT JOIN (
          SELECT following_id, json_agg(follower_id) AS follower_ids
          FROM user_follows
          GROUP BY following_id
        ) followers ON u.id = followers.following_id
        GROUP BY c.post_id
      ) comments ON p.id = comments.post_id
      ORDER BY p.created_at DESC;
    `;

    const postsResult = await pool.query(postsQuery);
    const posts = postsResult.rows.map((post) => ({
      id: post.post_id,
      user: {
        id: post.user_id,
        username: post.username,
        fullName: post.full_name,
        email: post.email,
        followers: [], // followers and following are not needed here
        following: [],
        profileImg: post.profile_img
          ? `http://localhost:8585/${post.profile_img}`
          : null,
        bio: post.bio,
        link: post.link,
        createdAt: post.user_created_at,
        updatedAt: post.user_updated_at,
        likedPosts: [], // likedPosts can be populated in another query or removed if not required
      },
      text: post.text,
      img: post.post_img ? `http://localhost:8585/${post.post_img}` : null,
      likes: post.likes,
      comments: post.comments,
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
    }));

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllPosts;
