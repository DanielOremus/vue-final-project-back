import CategoryManager from "../models/category/CategoryManager.mjs"

class ProductValidator {
  static defaultSchema = {
    name: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Name is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 30,
        },
        errorMessage: "Name must be between 3 and 30 chars long",
      },
    },
    description: {
      optional: true,
      trim: true,
      escape: true,
      customSanitizer: {
        options: (value) => {
          return value === "null" || value === "" ? null : value
        },
      },
      custom: {
        options: (value) => {
          if (value === null) return true
          if (value.length < 10 || value.length > 200) {
            throw new Error("Description must be between 10 and 200 chars long")
          }
          return true
        },
      },
    },
    price: {
      notEmpty: {
        errorMessage: "Price is required",
        bail: true,
      },
      isFloat: {
        options: {
          gt: 0,
        },
        errorMessage: "Price must be a positive number",
      },
      toFloat: true,
    },
    mass: {
      notEmpty: {
        errorMessage: "Mass is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: 50,
        },
        errorMessage: "Mass must be at least 50 grams",
      },
      toFloat: true,
    },
    category: {
      notEmpty: {
        errorMessage: "Category must be attached",
        bail: true,
      },
      custom: {
        options: async (value, { req }) => {
          const exists = await CategoryManager.getOne({ value })
          if (!exists) throw new Error("Attached category doest not exist")
          req.category = exists._id
        },
        errorMessage: "Attached category doest not exist",
      },
    },
    shouldDeleteImg: {
      optional: true,
      isBoolean: {
        errorMessage: "shouldDeleteImg must be boolean",
      },
      toBoolean: true,
    },
  }
}

export default ProductValidator
