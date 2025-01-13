import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

export default isAuth;
