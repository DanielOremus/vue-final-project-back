import mongoose from "mongoose"
import UserManager from "../user/UserManager.mjs"
import RoleManager from "./RoleManager.mjs"

const permissionsSchema = new mongoose.Schema({
  create: {
    type: Boolean,
    default: false,
  },
  read: {
    type: Boolean,
    default: false,
  },
  update: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
})

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxLength: [20, "Name must be at most 20 chars long"],
    unique: [true, "Name must be unique"],
    trim: true,
  },
  permissions: {
    products: {
      type: permissionsSchema,
      default: {
        create: false,
        read: true,
        update: true,
        delete: true,
      },
    },
    roles: {
      type: permissionsSchema,
      default: {
        create: false,
        read: false,
        update: false,
        delete: false,
      },
    },
  },
})
roleSchema.pre("findOneAndDelete", async function (next) {
  try {
    const roleId = this.getFilter()?._id
    if (!roleId) next()
    const defaultRole = await RoleManager.getOne({ name: "User" })
    await UserManager.updateMany(
      { role: roleId },
      { $set: { role: defaultRole._id } }
    )
    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model("Role", roleSchema)
