import { pool } from "../../db/connectPostgres.js";
import bcrypt from "bcrypt";

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;

    const fullName = req.body.fullName;
    const email = req.body.email;
    const username = req.body.username;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const bio = req.body.bio;
    const link = req.body.link;
    const phoneNumber = req.body.phoneNumber;
    const businessType = req.body.businessType;
    const businessLocation = req.body.businessLocation;

    let profileImgId = null;

    const userQuery = `
    SELECT * 
    FROM users
    WHERE id = $1
    `;

    const userResult = await pool.query(userQuery, [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    if (req.files?.profileImg) {
      const file = req.files.profileImg[0];

      const fileInsertQuery = `
        INSERT INTO files (fieldname, originalname, encoding, mimetype, destination, filename, path, size)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `;

      const fileResult = await pool.query(fileInsertQuery, [
        file.fieldname,
        file.originalname,
        file.encoding,
        file.mimetype,
        file.destination,
        file.filename,
        file.path,
        file.size,
      ]);
      profileImgId = fileResult.rows[0].id;
    }

    const updateQuery = `
    UPDATE users
    SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        username = COALESCE($3, username),
        password = COALESCE($4, password),
        bio = COALESCE($5, bio),
        link = COALESCE($6, link),
        profile_img = COALESCE($7, profile_img),
        phone_number = COALESCE($8, phone_number),
        business_type = COALESCE($9, business_type),
        business_location = COALESCE($10, business_location),
        updated_at = NOW()
    WHERE id = $11
    RETURNING id, full_name, username, email, bio, link, profile_img, phone_number, business_type, business_location
    `;

    const updatedResult = await pool.query(updateQuery, [
      fullName || null,
      email || null,
      username || null,
      user.password || null,
      bio || null,
      link || null,
      profileImgId || null,
      phoneNumber || null,
      businessType || null,
      businessLocation || null,
      userId,
    ]);
    res.status(200).json(updatedResult.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default updateUser;
