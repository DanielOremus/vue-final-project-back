import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Category from "./Category.mjs"

class CategoryManager extends MongooseCRUDManager {}

export default new CategoryManager(Category)
