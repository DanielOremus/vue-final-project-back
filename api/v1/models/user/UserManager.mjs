import User from "./User.mjs"
import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import RoleManager from "../role/RoleManager.mjs"
class UserManager extends MongooseCRUDManager {
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
      fieldName: "role",
      filterCategory: "list",
    },
  ]
  async getListWithQuery(reqQuery, projection = null, populateFields = []) {
    try {
      const { documents, count } = await super.getListWithQuery(
        reqQuery,
        projection,
        UserManager.fieldsConfiguration,
        populateFields
      )

      return { documents, count }
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async create(userData) {
    try {
      let roleId = userData.role
      if (!roleId) {
        roleId = (await RoleManager.getOne({ name: "User" }))._id
      }

      return await super.create({ ...userData, role: roleId })
    } catch (error) {
      throw new Error("Error creating user: " + error.message)
    }
  }
}

export default new UserManager(User)
