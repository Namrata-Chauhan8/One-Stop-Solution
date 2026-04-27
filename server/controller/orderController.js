import { Order } from "../model/orderModel.js";
import { Product } from "../model/productModel.js";
import { stripe } from "../server.js";

//create order controller
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    await Order.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      tax,
      shippingCharges,
    });
    //stock update
    for (let i = 0; i < orderItems.length; i++) {
      const product = await Product.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }

    return res.status(201).send({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating order",
      error,
    });
  }
};

//Get all my orders
export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "Orders not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};

//Get single orders
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};

// Accept Payment Controller
export const paymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    // Validate amount
    if (!totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Total amount is required",
      });
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be a positive number",
      });
    }

    // Convert amount to paise (smallest currency unit for INR)
    // Stripe expects amount in the smallest currency unit
    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise > 99999999) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds maximum limit",
      });
    }

    // Create payment intent with await
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "inr",
      metadata: {
        userId: req.user._id,
        orderDate: new Date().toISOString(),
      },
    });

    // Validate response
    if (!paymentIntent || !paymentIntent.client_secret) {
      return res.status(500).json({
        success: false,
        message: "Failed to create payment intent",
      });
    }

    return res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.log("Payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in payment gateway",
      error: error.message || error,
    });
  }
};

// Get All Orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};

// Change Order status controller
export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    if (order.orderStatus === "Processing") {
      order.orderStatus = "Shipped";
    } else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(400).send({
        success: false,
        message: "Order is already delivered",
      });
    }
    await order.save();

    return res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      status: order.orderStatus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting orders",
      error,
    });
  }
};
