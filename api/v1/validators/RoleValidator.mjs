import { config as permissionsConfig } from "peaker-perm-config"
import RoleManager from "../models/role/RoleManager.mjs"

class RoleValidator {
  static defaultSchema = {
    name: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Name is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 30,
        },
        errorMessage: "Name must be between 3 and 30 chars long",
      },
      custom: {
        options: async (val, { req }) => {
          const roleId = req.params.id
          const exists = await RoleManager.getOne({
            name: val,
            _id: { $ne: roleId },
          })
          if (exists)
            throw {
              message: "This name is already in use",
              type: "alreadyInUse",
            }
          return true
        },
      },
    },
    permissions: {
      isObject: {
        options: {
          strict: true,
        },
        errorMessage: "Permissions must be an object",
      },
      custom: {
        options: (val) => {
          const pages = Object.keys(permissionsConfig)
          for (const page of pages) {
            const pagePerms = val[page]
            if (typeof pagePerms !== "object" || !pagePerms) {
              throw new Error(`Missing permissions for '${page}'`)
            }
            const expectedKeys = permissionsConfig[page]
            const currentKeys = Object.keys(pagePerms)

            const hasMissing = expectedKeys.some(
              (k) => !currentKeys.includes(k)
            )
            const hasExtra = currentKeys.some((k) => !expectedKeys.includes(k))

            if (hasMissing || hasExtra) {
              throw new Error(
                `Permissions for '${page}' have incorrect structure`
              )
            }
            for (const key of expectedKeys) {
              if (typeof pagePerms[key] !== "boolean")
                throw new Error(
                  `Permission '${key}' for '${page}' must be boolean`
                )
            }
          }
          return true
        },
      },
    },
  }
}

export default RoleValidator
