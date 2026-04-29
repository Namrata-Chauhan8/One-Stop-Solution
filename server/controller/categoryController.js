import { Categories } from "../model/categoryModel.js";
import { Product } from "../model/productModel.js";

const normalizeCategoryName = (value) => value?.trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//get all categories controller
export const getAllCategoriesController = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10);
    const limit = Number.parseInt(req.query.limit, 10);
    const shouldPaginate =
      req.query.page !== undefined || req.query.limit !== undefined;
    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
    const pageLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const keyword = normalizeCategoryName(req.query.keyword);
    const filter = {};

    if (keyword) {
      filter.category = { $regex: escapeRegex(keyword), $options: "i" };
    }

    const totalCategories = await Categories.countDocuments(filter);
    if (!shouldPaginate) {
      const categories = await Categories.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        message: "Categories fetched successfully",
        success: true,
        totalCategories,
        categories,
      });
    }

    const totalPages = Math.max(1, Math.ceil(totalCategories / pageLimit));
    const safePage = Math.min(currentPage, totalPages);
    const skip = (safePage - 1) * pageLimit;
    const categories = await Categories.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      message: "Categories fetched successfully",
      success: true,
      totalCategories,
      categories,
      pagination: {
        totalCategories,
        totalPages,
        currentPage: safePage,
        pageSize: pageLimit,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
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
    const category = normalizeCategoryName(req.body.category);
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const existingCategory = await Categories.findOne({
      category: { $regex: `^${escapeRegex(category)}$`, $options: "i" },
    });
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
    await Product.updateMany(
      { category: category._id },
      { $unset: { category: "" } },
    );

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

    const updatedCategory = normalizeCategoryName(
      req.body.updatedCategory ?? req.body.category,
    );

    if (!updatedCategory) {
      return res
        .status(400)
        .json({ message: "Updated category is required", success: false });
    }

    const existingCategory = await Categories.findOne({
      _id: { $ne: category._id },
      category: { $regex: `^${escapeRegex(updatedCategory)}$`, $options: "i" },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category already exists", success: false });
    }

    category.category = updatedCategory;
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
