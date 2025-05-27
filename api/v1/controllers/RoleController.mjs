import { validationResult } from "express-validator"
import RoleManager from "../models/role/RoleManager.mjs"

class RoleController {
  static defaultStartPage = 0
  static defaultPerPage = 8
  static async getRolesWithQuery(req, res) {
    let { page, perPage, ...userQuery } = req.query
    page = parseInt(page)
    perPage = parseInt(perPage)
    if (!isFinite(page) || page < 0) page = RoleController.defaultStartPage
    if (!isFinite(perPage) || perPage <= 0)
      perPage = RoleController.defaultPerPage
    try {
      const { documents, count } = await RoleManager.getListWithQuery({
        page,
        perPage,
        ...userQuery,
      })
      return res.json({
        success: true,
        data: { roles: documents, count, page, perPage },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async createOrUpdateRole(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }

    const id = req.params.id
    const { name, permissions } = req.body

    let role
    try {
      if (id) {
        role = await RoleManager.getById(id)
        if (!role) {
          return res
            .status(404)
            .json({ success: false, msg: "Target role not found" })
        }
        role = await RoleManager.updateById(id, { name, permissions })
        res.json({ success: true, data: { role } })
      } else {
        role = await RoleManager.create({ name, permissions })
        res.status(201).json({ success: true, data: { role } })
      }
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async deleteRole(req, res) {
    const id = req.body.id

    try {
      const role = await RoleManager.deleteById(id)
      if (!role) {
        return res
          .status(404)
          .json({ success: false, msg: "Target role not found" })
      }
      res.json({ success: true, msg: "Role delete successfully" })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default RoleController
