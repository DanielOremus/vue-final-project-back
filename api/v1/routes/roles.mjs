import { Router } from "express"
import { getPermissionChecker } from "../../../middlewares/auth.mjs"
import { checkIdFormat } from "../../../middlewares/checkIdFormat.mjs"
import { checkSchema } from "express-validator"
import RoleValidator from "../validators/RoleValidator.mjs"
import RoleController from "../controllers/RoleController.mjs"
import upload from "../../../middlewares/multer.mjs"

const router = Router()
const checkPerm = getPermissionChecker("roles")

router.get("/", checkPerm("read"), RoleController.getRolesWithQuery)

router.get("/name/:roleName", checkPerm("read"), RoleController.getRoleByName)

router.post(
  "/",
  checkPerm("create"),
  checkSchema(RoleValidator.defaultSchema),
  RoleController.createOrUpdateRole
)

router.put(
  "/:id",
  checkPerm("update"),
  checkIdFormat("id", "params"),
  checkSchema(RoleValidator.defaultSchema),
  RoleController.createOrUpdateRole
)

router.delete(
  "/",
  checkPerm("delete"),
  checkIdFormat("id", "body"),
  RoleController.deleteRole
)

export default router
