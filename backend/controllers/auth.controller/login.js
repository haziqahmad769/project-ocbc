import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/connectPostgres.js";
import { validateEmail } from "../../utils/helper.js";

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Password and email are required",
      });
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const query = `
        SELECT *
        FROM users
        WHERE email = $1
        `;

    const dbRes = await pool.query(query, [email]);
    const user = dbRes.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }

    const data = {
      id: user.id,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(data, secretKey, {
      expiresIn: "15d",
    });

    // res.cookie("jwt", token, {
    //   maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    //   httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    //   sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    // });

    res.cookie("jwt", token, {
      httpOnly: true, // Prevent access by JavaScript
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "lax", // Adjust based on your cross-origin needs
      path: "/", // Ensure it matches
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
    

    res.status(200).json({
      message: "Login successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    // res.cookie("jwt", "", { maxAge: 0 });
    
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Expire immediately
    });
    
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
