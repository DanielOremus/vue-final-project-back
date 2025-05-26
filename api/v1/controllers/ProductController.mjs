import ImageManager from "../../../utils/ImageManager.mjs"
import CategoryManager from "../models/category/CategoryManager.mjs"
import ProductManager from "../models/product/ProductManager.mjs"
import { validationResult } from "express-validator"

class ProductController {
  static defaultStartPage = 0
  static defaultPerPage = 8
  static async fetchProducts(req, res) {
    try {
      const { documents, count } = await ProductManager.getList(
        {},
        null,
        null,
        ["category"]
      )
      return res.json({ success: true, data: { products: documents, count } })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async fetchProductsWithQuery(req, res) {
    //TODO: optimize method
    let { page, perPage, ...userQuery } = req.query
    console.log(userQuery)

    page = parseFloat(page)
    perPage = parseFloat(perPage)
    if (!page || page !== Math.abs(parseInt(page)))
      page = ProductController.defaultStartPage
    if (!perPage || perPage !== Math.abs(parseInt(perPage)))
      perPage = ProductController.defaultPerPage
    try {
      const { documents, count } = await ProductManager.getListWithQuery(
        { page, perPage, ...userQuery },
        null,
        ["category"]
      )
      return res.json({
        success: true,
        data: { products: documents, count, page, perPage },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async fetchProductById(req, res) {
    const id = req.params.id
    try {
      const product = await ProductManager.getById(id, null, ["category"])
      if (!product)
        return res
          .status(404)
          .json({ success: false, msg: "Product by id not found" })
      res.json({
        success: true,
        data: {
          product,
        },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async fetchProductFilters(req, res) {
    try {
      const { documents: categories } = await CategoryManager.getList()
      res.json({ success: true, data: { categories } })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async createOrUpdateProduct(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }
    const id = req.params.id

    const { name, description, price, mass, shouldDeleteImg } = req.body
    const { category } = req

    let newImage = null
    if (req.file?.buffer && !shouldDeleteImg)
      newImage = await ImageManager.getOptimizedImg(req.file)
    let product

    try {
      if (id) {
        product = await ProductManager.getById(id)
        if (!product)
          return res
            .status(404)
            .json({ success: false, msg: "Target product not found" })
        const updatedFields = {
          name,
          description,
          price,
          mass,
          category,
        }
        if (shouldDeleteImg) {
          updatedFields.image = null
        } else if (newImage) {
          updatedFields.image = newImage
        }
        product = await ProductManager.updateById(id, updatedFields)
        res.json({ success: true, data: { product } })
      } else {
        product = await ProductManager.create({
          name,
          description,
          price,
          mass,
          category,
          newImage,
        })
        res.status(201).json({ success: true, data: { product } })
      }
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async deleteProduct(req, res) {
    const id = req.body.id

    try {
      const product = await ProductManager.deleteById(id)
      if (!product)
        return res
          .status(404)
          .json({ success: false, msg: "Target product not found" })
      res.json({ success: true, msg: "Product deleted successfully" })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default ProductController
