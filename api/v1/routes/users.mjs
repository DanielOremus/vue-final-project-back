import { Router } from "express"
import { getPermissionChecker } from "../../../middlewares/auth.mjs"
import UserController from "../controllers/UserController.mjs"
import { checkIdFormat } from "../../../middlewares/checkIdFormat.mjs"
import { checkSchema } from "express-validator"
import UserValidator from "../validators/UserValidator.mjs"

const router = Router()
const checkPerm = getPermissionChecker("users")

router.get("/", checkPerm("read"), UserController.getUsersWithQuery)

router.put(
  "/:id",
  checkPerm("update"),
  checkIdFormat("id", "params"),
  checkSchema(UserValidator.roleUpdateSchema),
  UserController.updateUserRole
)

export default router
