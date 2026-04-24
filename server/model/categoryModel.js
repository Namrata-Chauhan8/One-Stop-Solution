import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
});

export const Categories = mongoose.model("Categories", categorySchema);
