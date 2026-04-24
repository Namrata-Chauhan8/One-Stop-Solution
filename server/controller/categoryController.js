import { Categories } from "../model/categoryModel.js";
import { Product } from "../model/productModel.js";

//get all categories controller
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Categories.find({});

    return res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error, success: false });
  }
};

//create category controller
export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const existingCategory = await Categories.findOne({ category });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const newCategory = await Categories.create({ category });

    return res.status(201).json({
      message: "Category created successfully",
      newCategory,
      success: true,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }
    //find product with this category id
    const products = await Product.findOne({ category: category._id });

    //update product category to null
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();
    return res.status(200).json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

//update category controller
export const updateCategoryController = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    const { updatedCategory } = req.body;

    const product = await Product.findOne({ category: category._id });
    //update product category to null
    if (product) {
      for (let i = 0; i < product.length; i++) {
        const product = product[i];
        product.category = updatedCategory;
        await product.save();
      }
    }
    if (updatedCategory) {
      category.category = updatedCategory;
    }

    await category.save();
    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
