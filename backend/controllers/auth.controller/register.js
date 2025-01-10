import { pool } from "../../db/connectPostgres.js";
import { validateEmail } from "../../utils/helper.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;

    if (!password || !email) {
      return res.status(400).json({
        message: "Password and email is required",
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
        message: " Email already exist",
      });
    }

    const insertNewUser = `
    INSERT INTO users (password, email)
    VALUES ($1, $2)
    `;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const dbRes = await pool.query(insertNewUser, [hashedPassword, email]);

    return res.status(200).json({
      message: "User is created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default register;
