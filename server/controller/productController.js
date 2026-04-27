import { Product } from "../model/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

// Get All Products controller
export const getAllProductsController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await Product.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
      category: category ? category : "",
    }).populate("category");
    return res.status(200).send({
      success: true,
      message: "All Products List",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

export const getTopProductsController = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    return res.status(200).json ({
      success: true,
      message: "Top Products List",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

//Get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

//Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !stock) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please provide an image for the product",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    return res.status(201).send({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

//Update Product Image
export const updateProductImageController = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please provide an image for the product",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.images.push(image);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product image updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating product image",
      error,
    });
  }
};

//Delete Product Image
export const deleteProductImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    const isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) {
        isExist = index;
      }
      if (isExist < 0) {
        return res.status(404).send({
          success: false,
          message: "Image not found",
        });
      }
      //Delete image from cloudinary
    });
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product image deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting product image",
      error,
    });
  }
};

//Delete Product
export const DeleteProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log("product: ", product);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    //find and delete image from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.deleteOne();
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in deleting product",
      error,
    });
  }
};

export const createProductReviewController = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product already reviewed",
      });
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Review created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating review",
      error,
    });
  }
};
