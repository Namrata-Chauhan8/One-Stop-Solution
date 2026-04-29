import express, { Router } from "express";
import {
  loginController,
  signupController,
  getProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
  updateProfilePictureController,
  deleteProfilePictureController,
  getAllUsersController,
} from "../controller/userController.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = Router();

//routes
//signup
router.post("/signup", signupController);

//login
router.post("/login", loginController);

//profile
router.get("/profile", isAuthenticated, getProfileController);

//admin users
router.get("/admin/get-all", isAuthenticated, isAdmin, getAllUsersController);

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

router.delete(
  "/delete-profile-picture",
  isAuthenticated,
  deleteProfilePictureController,
);

export default router;
