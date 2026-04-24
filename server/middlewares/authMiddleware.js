import jwt from "jsonwebtoken";
export const isAuthenticated = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData;
  next();
};
