import UserManager from "../models/user/UserManager.mjs"
import JWTHelper from "../../../utils/JWTHelper.mjs"
import { validationResult } from "express-validator"
import RoleManager from "../models/role/RoleManager.mjs"

class UserController {
  static defaultStartPage = 0
  static defaultPerPage = 8
  static async register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }
    const { username, password, email, role } = req.body

    try {
      if (role) {
        const roleExists = await RoleManager.getById(role)
        if (!roleExists)
          return res
            .status(400)
            .json({ success: false, msg: "Provided role does not exist" })
      }
      await UserManager.create({ username, email, password, role })
      const token = JWTHelper.prepareToken({ username, email }, req.headers)
      res.status(201).json({
        success: true,
        data: {
          token,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, msg: errors.array() })
    }
    const { email, password } = req.body
    try {
      const user = await UserManager.getOne({ email })
      if (!user) {
        return res
          .status(401)
          .json({ success: false, msg: "Email or password is incorrect" })
      }

      const isPasswordCorrect = await user.validatePassword(password)
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ success: false, msg: "Email or password is incorrect" })
      }

      const token = JWTHelper.prepareToken(
        { username: user.username, email: user.email },
        req.headers
      )
      res.json({
        success: true,
        data: {
          token,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getUserById(req, res) {
    const id = req.body.id
    try {
      const user = await UserManager.getById(id, { password: 0 }, ["role"])
      if (!user)
        return res
          .status(404)
          .json({ success: false, msg: "Profile not found" })
      res.json({
        success: true,
        data: {
          profile: user,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getUsersWithQuery(req, res) {
    let { page, perPage, ...userQuery } = req.query

    page = parseInt(page)
    perPage = parseInt(perPage)
    if (!isFinite(page) || page < 0) page = UserController.defaultStartPage
    if (!isFinite(perPage) || perPage < 0)
      perPage = UserController.defaultPerPage
    try {
      const { documents, count } = await UserManager.getListWithQuery(
        { page, perPage, ...userQuery },
        null,
        ["role"]
      )
      return res.json({
        success: true,
        data: { products: documents, count, page, perPage },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default UserController
