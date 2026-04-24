import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
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
router.post("/create-category", isAuthenticated, createCategoryController);

//delete category
router.delete(
  "/delete-category/:id",
  isAuthenticated,
  deleteCategoryController,
);

//update category
router.put("/update-category/:id", isAuthenticated, updateCategoryController);

export default router;
