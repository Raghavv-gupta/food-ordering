import jwt from "jsonwebtoken";

export default function authCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "customer") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.customerId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token invalid or expired" });
  }
}
