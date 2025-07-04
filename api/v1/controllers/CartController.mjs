import CartManager from "../models/cart/CartManager.mjs"
import { validationResult } from "express-validator"

class CartController {
  static async getCartByUserId(req, res) {
    const userId = req.user._id
    try {
      const cart = await CartManager.getByUserId(userId, ["products.product"])
      if (!cart) {
        return res.status(404).json({ success: false, msg: "Cart not found" })
      }
      res.json({ success: true, data: { cart } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async addProduct(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }

    const productId = req.body.productId
    const userId = req.user._id

    try {
      const cart = await CartManager.addProduct(userId, productId)

      res.json({ success: true, data: { cart } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async updateQuantity(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }

    const { productId, quantity } = req.body
    const userId = req.user._id

    try {
      const cart = await CartManager.updateQuantity(
        userId,
        productId,
        quantity,
        ["products.product"]
      )

      res.json({ success: true, data: { cart } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async removeProduct(req, res) {
    const productId = req.body.productId
    const userId = req.user._id

    try {
      const cart = await CartManager.removeProduct(userId, productId, [
        "products.product",
      ])

      res.json({ success: true, data: { cart } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async mergeCarts(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }
    const localCartProducts = req.body.productsList
    const userId = req.user._id
    try {
      const cart = await CartManager.getByUserId(userId)
      if (!cart) {
        return res.status(404).json({ success: false, msg: "Cart not found" })
      }
      const mergedCart = await CartManager.merge(userId, localCartProducts)
      res.json({ success: true, data: { cart: mergedCart } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default CartController
