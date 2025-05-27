import CategoryManager from "../models/category/CategoryManager.mjs"

class CategoryController {
  static async getCategories(req, res) {
    try {
      const { documents, count } = await CategoryManager.getList()
      res.json({
        success: true,
        data: {
          categories: documents,
          count,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default CategoryController
