import { Router } from "express"
import { getPermissionChecker } from "../../../middlewares/auth.mjs"
import UserController from "../controllers/UserController.mjs"

const router = Router()
const checkPerm = getPermissionChecker("users")

router.get("/", checkPerm("read"), UserController.getUsersWithQuery)

export default router
