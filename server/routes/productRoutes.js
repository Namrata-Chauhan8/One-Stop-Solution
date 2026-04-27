import express, { Router } from "express";
import {
  createProductController,
  createProductReviewController,
  DeleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getSingleProductController,
  getTopProductsController,
  updateProductController,
  updateProductImageController,
} from "../controller/productController.js";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = Router();

//routes
//get all products
router.get("/get-all", getAllProductsController);

//get top product controller
router.get("/top", getTopProductsController);

//get single product
router.get("/:id", getSingleProductController);

//Create product
router.post(
  "/create-product",
  isAuthenticated,
  singleUpload,
  createProductController,
);

//Update product
router.put("/:id", isAuthenticated, isAdmin, updateProductController);

//Update Product Image
router.put(
  "/update-image/:id",
  isAuthenticated,
  isAdmin,
  singleUpload,
  updateProductImageController,
);

//Delete product image
router.delete(
  "/delete-image/:id",
  isAuthenticated,
  isAdmin,
  deleteProductImageController,
);

export default router;

//Delete product
router.delete("/:id", isAuthenticated, DeleteProductController);

//Create Product review
router.post("/:id/review", isAuthenticated, createProductReviewController);
