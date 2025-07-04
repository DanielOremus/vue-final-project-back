import mongoose from "mongoose"

const cartProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      required: [true, "Product Id is required"],
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be positive"],
      validate: {
        validator: (v) => v === parseInt(v),
        message: "Quantity must be an integer",
      },
    },
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "User must be attached to cart"],
    ref: "User",
  },
  products: {
    type: [cartProductSchema],
  },
})

export default mongoose.model("Cart", cartSchema)
