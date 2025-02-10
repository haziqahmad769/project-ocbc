import { pool } from "../../db/connectPostgres.js";

const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;

    const userQuery = `
        SELECT u.id AS user_id, u.username, u.full_name, u.email, u.bio, u.link,
             u.created_at AS user_created_at, u.updated_at AS user_updated_at,
             f.path AS profile_img
      FROM users u
      LEFT JOIN files f ON u.profile_img = f.id
      WHERE u.username = $1
        `;

    const userResult = await pool.query(userQuery, [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userPostsQuery = `
        SELECT 
        p.id AS post_id, 
        p.text, 
        p.created_at AS post_created_at, 
        p.updated_at AS post_updated_at,
        imgf.path AS post_img,
        COALESCE(likes.like_user_ids, '[]')::json AS likes,
        COALESCE(comments.comment_data, '[]')::json AS comments
      FROM posts p
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
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC;
        `;
    const postsResult = await pool.query(userPostsQuery, [user.user_id]);

    const posts = postsResult.rows.map((post) => ({
      id: post.post_id,
      user: {
        id: user.user_id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        followers: [], // Add followers if needed
        following: [], // Add following if needed
        profileImg: user.profile_img
          ? `${process.env.SERVER_URL}/${user.profile_img}`
          : null,
        bio: user.bio,
        link: user.link,
        createdAt: user.user_created_at,
        updatedAt: user.user_updated_at,
        likedPosts: [], // Add likedPosts if needed
      },
      text: post.text,
      img: post.post_img ? `${process.env.SERVER_URL}/${post.post_img}` : null,
      likes: post.likes,
      comments: post.comments.map((comment) => ({
        ...comment,
        user: {
          ...comment.user,
          profileImg: comment.user.profileImg
            ? `${process.env.SERVER_URL}/${comment.user.profileImg}`
            : null,
        },
      })),
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

export default getUserPosts;
