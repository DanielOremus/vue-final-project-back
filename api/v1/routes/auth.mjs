import { Router } from "express"
import UserController from "../controllers/UserController.mjs"
import { checkSchema } from "express-validator"
import AuthValidator from "../validators/AuthValidator.mjs"
import { ensureAuthenticated } from "../../../middlewares/auth.mjs"

const router = Router()

router.post(
  "/register",
  checkSchema(AuthValidator.registerSchema),
  UserController.register
)
router.post(
  "/login",
  checkSchema(AuthValidator.loginSchema),
  UserController.login
)

router.post(
  "/profile",
  ensureAuthenticated,
  (req, res, next) => {
    req.body.id = req.user?._id
    next()
  },
  UserController.getUserById
)

export default router
