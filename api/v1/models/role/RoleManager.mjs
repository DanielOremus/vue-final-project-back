import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Role from "./Role.mjs"

class RoleManager extends MongooseCRUDManager {
  async addNewPage(roleId, pageName, permsObj) {
    try {
      const role = await this.model.findByIdAndUpdate(
        roleId,
        {
          $set: {
            [`permissions.${pageName}`]: permsObj,
          },
        },
        { new: true }
      )
      return role
    } catch (error) {
      throw new Error("Error adding page to role: " + error.message)
    }
  }
}

export default new RoleManager(Role)
