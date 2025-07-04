import { Router } from "express"
import { ensureAuthenticated } from "../../../middlewares/auth.mjs"
import CartController from "../controllers/CartController.mjs"
import { checkSchema } from "express-validator"
import CartValidator from "../validators/CartValidator.mjs"
import { checkIdFormat } from "../../../middlewares/checkIdFormat.mjs"

const router = new Router()

router.get("/", ensureAuthenticated, CartController.getCartByUserId)

router.post(
  "/",
  ensureAuthenticated,
  checkSchema(CartValidator.existsProductSchema),
  CartController.addProduct
)
router.post(
  "/merge",
  ensureAuthenticated,
  checkSchema(CartValidator.mergeSchema),
  CartController.mergeCarts
)
router.put(
  "/quantity",
  ensureAuthenticated,
  checkIdFormat("productId", "body"),
  checkSchema(CartValidator.updateQuantitySchema),
  CartController.updateQuantity
)
router.delete(
  "/",
  ensureAuthenticated,
  checkIdFormat("productId", "body"),
  CartController.removeProduct
)

export default router
