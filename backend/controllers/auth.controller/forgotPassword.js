import { pool } from "../../db/connectPostgres.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const userQuery = `
        SELECT * 
        FROM users 
        WHERE email = $1
        `;

    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "15m",
    // });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
              <p>Hi ${user.full_name},</p>
              <p>You requested a password reset. Click the link below to reset your password:</p>
              <a href="${resetLink}" target="_blank">${resetLink}</a>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default forgotPassword;
