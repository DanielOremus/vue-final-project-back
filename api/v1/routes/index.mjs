import { Router } from "express"
import productRoutes from "./products.mjs"
import categoryRoutes from "./categories.mjs"
import authRoutes from "./auth.mjs"
import roleRoutes from "./roles.mjs"
const router = Router()

router.use("/products", productRoutes)
router.use("/categories", categoryRoutes)
router.use("/auth", authRoutes)
router.use("/roles", roleRoutes)

export default router
