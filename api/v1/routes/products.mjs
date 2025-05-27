import { Router } from "express"
import ProductController from "../controllers/ProductController.mjs"
import upload from "../../../middlewares/multer.mjs"
import { checkSchema } from "express-validator"
import ProductValidator from "../validators/ProductValidator.mjs"
import { checkIdFormat } from "../../../middlewares/checkIdFormat.mjs"
import { getPermissionChecker } from "../../../middlewares/auth.mjs"

const checkPerm = getPermissionChecker("products")

const router = Router()

router.get("/", ProductController.getProductsWithQuery)

router.get("/filters", ProductController.getProductFilters)

router.get(
  "/:id",
  checkIdFormat("id", "params"),
  ProductController.getProductById
)

router.post(
  "/",
  upload.single("image"),
  checkPerm("create"),
  checkSchema(ProductValidator.defaultSchema),
  ProductController.createOrUpdateProduct
)

router.put(
  "/:id",
  upload.single("image"),
  checkPerm("update"),
  checkIdFormat("id", "params"),
  checkSchema(ProductValidator.defaultSchema),
  ProductController.createOrUpdateProduct
)

router.delete(
  "/",
  checkPerm("delete"),
  checkIdFormat("id", "body"),
  ProductController.deleteProduct
)

export default router
