import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 chars long"],
    maxlength: [20, "Name must be at most 20 chars long"],
    trim: true,
  },
  value: {
    type: String,
    required: [true, "Value is required"],
    minlength: [3, "Value must be at least 3 chars long"],
    maxlength: [20, "Value must be at most 20 chars long"],
    trim: true,
  },
})

export default mongoose.model("Category", categorySchema)
