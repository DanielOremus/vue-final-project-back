import mongoose from "mongoose"
import CartManager from "../cart/CartManager.mjs"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 chars long"],
    maxlength: [50, "Name must be at most 50 chars long"],
    trim: true,
  },
  description: {
    type: String,
    minlength: [10, "Description must be at least 10 chars long"],
    maxlength: [400, "Description must be at most 400 chars long"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  mass: {
    type: Number,
    required: [true, "Mass i required"],
    min: [50, "Mass must be at least 50 grams"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Category must be attached"],
    ref: "Category",
  },
  image: String,
})

export default mongoose.model("Product", productSchema)
