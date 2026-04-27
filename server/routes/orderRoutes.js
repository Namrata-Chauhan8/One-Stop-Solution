import express, { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  paymentController,
  createOrderController,
  getMyOrdersController,
  getSingleOrderController,
  getAllOrdersController,
  changeOrderStatusController,
} from "../controller/orderController.js";

const router = Router();

//routes

//create Order
router.post("/create-order", isAuthenticated, createOrderController);

//get all orders
router.get("/get-my-orders", isAuthenticated, getMyOrdersController);

//Get single order
router.get("/get-order/:id", isAuthenticated, getSingleOrderController);

//accept payment
router.post("/payment", isAuthenticated, paymentController);

//======================== Admin Part ============================//

router.get("/admin/orders", isAuthenticated, isAdmin, getAllOrdersController);

//change order status
router.put(
  "/admin/orders/:id",
  isAuthenticated,
  isAdmin,
  changeOrderStatusController,
);

export default router;
