import jwt, { decode } from "jsonwebtoken";
import { User } from "../model/userModel.js";

//For user
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData._id);
  next();
};

//For Admin
export const isAdmin = (req, res, next) => {
  if (req?.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  next();
};
