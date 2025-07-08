import CategoryManager from "../models/category/CategoryManager.mjs"
import { isValidObjectId } from "mongoose"

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
          max: 50,
        },
        errorMessage: "Name must be between 3 and 50 chars long",
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
          if (value.length < 10 || value.length > 400) {
            throw new Error("Description must be between 10 and 400 chars long")
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
          gt: 0,
        },
        errorMessage: "Mass must be positive number",
      },
      toFloat: true,
    },
    category: {
      notEmpty: {
        errorMessage: "Category must be attached",
        bail: true,
      },
      custom: {
        options: async (v, { req }) => {
          const exists = await CategoryManager.getOne({ value: { $eq: v } })
          if (!exists) throw new Error("Attached category does not exist")
          req.category = exists._id
          return true
        },
      },
    },
    shouldDeleteImg: {
      optional: true,
      isBoolean: {
        errorMessage: "'shouldDeleteImg' must be boolean",
      },
      toBoolean: true,
    },
  }
  static getByIdsSchema = {
    idsList: {
      isArray: {
        options: {
          min: 1,
        },
        errorMessage: "Ids list must be an array with at least 1 element",
        bail: true,
      },
      custom: {
        options: (v) => {
          for (const id of v) {
            if (!isValidObjectId(id))
              throw new Error("Ids list contains invalid id")
          }
          return true
        },
      },
    },
  }
}

export default ProductValidator
