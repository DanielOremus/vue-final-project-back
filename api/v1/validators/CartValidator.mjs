import ProductManager from "../models/product/ProductManager.mjs"
import { isValidObjectId } from "mongoose"
class CartValidator {
  static existsProductSchema = {
    productId: {
      notEmpty: {
        errorMessage: "Product id is required",
        bail: true,
      },
      isMongoId: {
        errorMessage: "Product id is invalid",
        bail: true,
      },
      custom: {
        options: async (v) => {
          const exists = await ProductManager.getById(v, { _id: 1 })
          if (!exists) {
            throw new Error("Product not found")
          }

          return true
        },
      },
    },
  }
  static updateQuantitySchema = {
    productId: CartValidator.existsProductSchema.productId,
    quantity: {
      notEmpty: {
        errorMessage: "Quantity is required",
        bail: true,
      },
      isInt: {
        options: {
          gt: 0,
        },
        errorMessage: "Quantity must be a positive integer",
      },
      toInt: true,
    },
  }
  static mergeSchema = {
    productsList: {
      isArray: {
        errorMessage: "Products list must be an array",
        bail: true,
      },
      custom: {
        options: (v) => {
          for (const cartProd of v) {
            if (
              typeof cartProd !== "object" ||
              !Object.hasOwn(cartProd, "product") ||
              !Object.hasOwn(cartProd, "quantity")
            )
              throw new Error(
                "Products list has product with invalid structure"
              )

            if (!isValidObjectId(cartProd.product))
              throw new Error(
                `Products list has product with invalid id '${cartProd.product}'`
              )
            if (
              !Number.isInteger(Number(cartProd.quantity)) ||
              cartProd.quantity <= 0
            )
              throw new Error(
                `Products list has product with invalid quantity number '${cartProd.quantity}'`
              )
          }
          return true
        },
      },
    },
  }
}

export default CartValidator
