import express, { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = Router();

//routes
//get all categories
router.get("/get-all", isAuthenticated, getAllCategoriesController);

//create category
router.post(
  "/create-category",
  isAuthenticated,
  isAdmin,
  createCategoryController,
);

//delete category
router.delete(
  "/delete-category/:id",
  isAuthenticated,
  isAdmin,
  deleteCategoryController,
);

//update category
router.put(
  "/update-category/:id",
  isAuthenticated,
  isAdmin,
   updateCategoryController,
);

export default router;
