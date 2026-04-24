import express, { Router } from "express";
import {
  loginController,
  signupController,
  getProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
  updateProfilePictureController,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = Router();

//routes
//signup
router.post("/signup", signupController);

//login
router.post("/login", loginController);

//profile
router.get("/profile", isAuthenticated, getProfileController);

//Logout
router.post("/logout", logoutController);

//update profile
router.put("/update-profile", isAuthenticated, updateProfileController);

//update password
router.put("/update-password", isAuthenticated, updatePasswordController);

//update profile picture
router.put(
  "/update-profile-picture",
  isAuthenticated,
  singleUpload,
  updateProfilePictureController,
);

export default router;
