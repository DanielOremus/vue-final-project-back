import User from "./User.mjs"
import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import RoleManager from "../role/RoleManager.mjs"
class UserManager extends MongooseCRUDManager {
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
