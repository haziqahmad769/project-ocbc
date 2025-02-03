import { pool } from "../../db/connectPostgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const newPassword = req.body.newPassword;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateQuery = `
    UPDATE users SET password = $1 WHERE id = $2
    `;
    await pool.query(updateQuery, [hashedPassword, userId]);

    res.status(200).json({
      message: "Password reset successfully. You can now log in",
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export default resetPassword;
