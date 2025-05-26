import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Product from "./Product.mjs"
import CategoryManager from "../category/CategoryManager.mjs"

class ProductManager extends MongooseCRUDManager {
  static fieldsConfiguration = [
    {
      fieldName: "price",
      filterCategory: "range",
    },
    {
      fieldName: "name",
      filterCategory: "search",
    },
    {
      fieldName: "category",
      filterCategory: "list",
      refModel: "Category",
      matchField: "value",
    },
  ]
  async getListWithQuery(reqQuery, projection = null, populateFields = []) {
    try {
      const { documents, count } = await super.getListWithQuery(
        reqQuery,
        projection,
        ProductManager.fieldsConfiguration,
        populateFields
      )

      return { documents, count }
    } catch (error) {
      console.log(error)

      return []
    }
  }
}

export default new ProductManager(Product)
