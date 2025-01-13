import { pool } from "../../db/connectPostgres.js";
import { validateEmail } from "../../utils/helper.js";
import bcrypt from "bcrypt";

const signup = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    const username = req.body.username;
    const fullName = req.body.fullName;

    if (!password || !email || !username || !fullName) {
      return res.status(400).json({
        message: "All fields is required",
      });
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const checkEmailQuery = `
    SELECT * 
    FROM users
    WHERE email = $1
    `;

    // check if email already exist
    const dbResEmail = await pool.query(checkEmailQuery, [email]);
    if (dbResEmail.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const checkUsernameQuery = `
    SELECT * 
    FROM users
    WHERE username = $1
    `;

    // check if username already exist
    const dbResUsername = await pool.query(checkUsernameQuery, [username]);
    if (dbResUsername.rows.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const insertNewUser = `
    INSERT INTO users (password, email,username, full_name)
    VALUES ($1, $2, $3, $4)
    `;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const dbRes = await pool.query(insertNewUser, [
      hashedPassword,
      email,
      username,
      fullName,
    ]);

    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default signup;
