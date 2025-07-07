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
        const defaultRole = await RoleManager.getOne({ name: "User" })
        roleId = defaultRole
      }

      return await super.create({ ...userData, role: roleId })
    } catch (error) {
      throw error
    }
  }
  async updateById(id, userProps) {
    try {
      return await super.updateById(
        id,
        userProps,
        {
          email: 0,
          password: 0,
        },
        ["role"]
      )
    } catch (error) {
      throw error
    }
  }
}

export default new UserManager(User)
