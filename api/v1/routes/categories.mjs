import { Router } from "express"
import CategoryController from "../controllers/CategoryController.mjs"

const router = Router()

router.get("/", CategoryController.getCategories)

export default router
