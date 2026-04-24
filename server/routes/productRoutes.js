import express, { Router } from "express";
import {
  createProductController,
  DeleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getSingleProductController,
  updateProductController,
  updateProductImageController,
} from "../controller/productController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = Router();

//routes
//get all products
router.get("/get-all", getAllProductsController);

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
router.put("/:id", isAuthenticated, updateProductController);

//Update Product Image
router.put(
  "/update-image/:id",
  isAuthenticated,
  singleUpload,
  updateProductImageController,
);

//Delete product image
router.delete(
  "/delete-image/:id",
  isAuthenticated,
  deleteProductImageController,
);

export default router;

//Delete product
router.delete("/:id", isAuthenticated, DeleteProductController);
