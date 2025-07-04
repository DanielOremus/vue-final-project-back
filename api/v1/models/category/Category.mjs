import mongoose from "mongoose"

const localizedNameSchema = new mongoose.Schema(
  {
    ua: {
      type: String,
      required: [true, "Name is required (ua)"],
      minlength: [3, "Name must be at least 3 chars long (ua)"],
      maxlength: [20, "Name must be at most 20 chars long (ua)"],
      trim: true,
    },
    en: {
      type: String,
      required: [true, "Name is required (en)"],
      minlength: [3, "Name must be at least 3 chars long (en)"],
      maxlength: [20, "Name must be at most 20 chars long (en)"],
      trim: true,
    },
  },
  { _id: false }
)

const categorySchema = new mongoose.Schema({
  name: {
    type: localizedNameSchema,
    required: true,
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
