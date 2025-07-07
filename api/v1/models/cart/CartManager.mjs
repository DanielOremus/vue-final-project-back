import MongooseCRUDManager from "../MongooseCRUDManager.mjs"
import Cart from "./Cart.mjs"
import ProductManager from "../product/ProductManager.mjs"

class CartManager extends MongooseCRUDManager {
  async getByUserId(userId, populateFields = []) {
    try {
      return await super.getOne(
        { user: { $eq: userId } },
        { user: 0 },
        populateFields
      )
    } catch (error) {
      console.log(error)
      throw new Error("Error while getting cart by user id: " + error.message)
    }
  }
  async addProduct(userId, productId) {
    try {
      let cart = await super.getOne({ user: { $eq: userId } }, { user: 0 })

      const prodIndex = cart.products.findIndex(
        ({ product }) => product._id.toString() === productId
      )

      if (prodIndex < 0) {
        cart.products.push({ product: productId, quantity: 1 })
      } else {
        cart.products[prodIndex].quantity++
      }

      cart = await cart.save()

      return cart
    } catch (error) {
      console.log(error)

      throw new Error("Error while adding product to cart: " + error.message)
    }
  }
  async updateQuantity(userId, productId, quantity, populateFields = []) {
    try {
      const query = this.model.findOneAndUpdate(
        {
          user: { $eq: userId },
          "products.product": { $eq: productId },
        },
        {
          $set: {
            "products.$.quantity": quantity,
          },
        },
        { projection: { user: 0 }, runValidator: true, new: true }
      )

      this.addPopulation(query, populateFields)

      return await query.exec()
    } catch (error) {
      console.log(error)
      throw new Error("Error while updating quantity in cart: " + error.message)
    }
  }
  async removeProduct(userId, productId, populateFields = []) {
    try {
      const query = this.model.findOneAndUpdate(
        { user: { $eq: userId } },
        {
          $pull: {
            products: { product: { $eq: productId } },
          },
        },
        { projection: { user: 0 }, new: true }
      )

      this.addPopulation(query, populateFields)

      return await query.exec()
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error while deleting product from cart: " + error.message
      )
    }
  }
  async merge(userId, localCartProducts) {
    //Створення масиву айдішок,
    //   обєкту з локальної корзини id:кількість,

    const localIdsQtyObj = {}
    const localIds = []

    for (let { product: productId, quantity } of localCartProducts) {
      quantity = parseInt(quantity)
      if (localIdsQtyObj[productId]) {
        localIdsQtyObj[productId] += quantity
      } else {
        localIdsQtyObj[productId] = quantity
        localIds.push(productId)
      }
    }
    try {
      //  Заповнення обєкту id:індекс продукта в серверній коризні
      let serverCart = await super.getOne(
        { user: { $eq: userId } },
        { user: 0 }
      )

      const serverIdsIndObj = {}
      serverCart.products.forEach((cartProd, i) => {
        serverIdsIndObj[cartProd.product.toString()] = i
      })

      //Відсіювання неіснуючих продуктів / знаходження лише існуючих
      const { documents: existProducts } = await ProductManager.getList({
        _id: { $in: localIds },
      })

      //Для кожного існуючого в БД продукту,
      //  при його наявності в серверній корзині, додаємо кількість до поточної
      // при його відсутності додаємо продукт в серверну корзину і встановлюємо поточну кількість
      existProducts.forEach(({ _id }) => {
        const strId = _id.toString()
        const productIndex = serverIdsIndObj[strId]
        const localQty = localIdsQtyObj[strId]
        if (isFinite(productIndex)) {
          serverCart.products[productIndex].quantity += localQty
        } else {
          serverCart.products.push({
            product: _id,
            quantity: localQty,
          })
        }
      })

      serverCart = await serverCart.save()

      return serverCart
    } catch (error) {
      console.log(error)
      throw new Error("Error while merging carts: " + error.message)
    }
  }
  async removeProductFromAllCarts(productId) {
    try {
      await this.model.updateMany(
        {
          "products.product": { $eq: productId },
        },
        {
          $pull: {
            products: { product: { $eq: productId } },
          },
        }
      )
      return true
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error while removing product from carts: " + error.message
      )
    }
  }
}

export default new CartManager(Cart)
