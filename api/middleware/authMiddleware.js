import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access Denied! No token provided." });

  try {
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // Extract token from "Bearer your-token"
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Store decoded user info in `req.user`
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token!" });
  }
};

export default authMiddleware;
