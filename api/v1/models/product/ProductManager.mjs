import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Product from "./Product.mjs"
import CartManager from "../cart/CartManager.mjs"

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
  static metaConfiguration = [
    {
      type: "lang",
      fields: ["category.name"],
    },
  ]
  async getListWithQuery(reqQuery, projection = null, populateFields = []) {
    try {
      const { documents, count } = await super.getListWithQuery(
        reqQuery,
        projection,
        ProductManager.fieldsConfiguration,
        populateFields,
        ProductManager.metaConfiguration
      )

      return { documents, count }
    } catch (error) {
      console.log("============")
      console.log("Error getting data with query: " + error.message)
      console.log(error)

      return { documents: [], count: 0 }
    }
  }
  async deleteProductCascade(productId) {
    try {
      const product = await super.deleteById(productId)
      if (!product) return null
      console.log(product)

      await CartManager.removeProductFromAllCarts(productId)
      return product
    } catch (error) {
      console.log("============")
      console.log("Product cascade delete error")
      console.log(error)
    }
  }
}

export default new ProductManager(Product)
