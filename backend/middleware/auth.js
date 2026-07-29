import jwt from "jsonwebtoken";

// auth middleware checks the incoming request for a JWT token
// and saves the user id on req.userId for later controllers.
export const protect = (req, res, next) => {

    // token is expected to come in Authorization header:
    // Authorization: Bearer <token>
    const header = req.headers.authorization || "";
    if (!header) 
      return res.status(401).json({ message: "No token provided" });

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) 
      return res.status(401).json({ message: "Invalid authorization header / no token" });

  
  try {
    // verify token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // store the logged in user id for next functions
    req.userId = decoded.id;

    // continue to the next middleware / route handler
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
