import RoleManager from "../models/role/RoleManager.mjs"

class UserValidator {
  static roleUpdateSchema = {
    role: {
      notEmpty: {
        errorMessage: "Role must be attached",
        bail: true,
      },
      isMongoId: {
        errorMessage: "Role id is invalid",
        bail: true,
      },
      custom: {
        options: async (v) => {
          const exists = await RoleManager.getById(v, { _id: 1 })
          if (!exists) {
            throw new Error("Attached role does not exist")
          }
          return true
        },
      },
    },
  }
}

export default UserValidator
