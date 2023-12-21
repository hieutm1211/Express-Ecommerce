const {
  BadRequestError
} = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const {
  getProductById
} = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = 'SA3'
  }) {
    const product = await getProductById(productId);

    if (!product) throw new BadRequestError('The product does not exist');

    const query = {
      inv_shopId: shopId,
      inv_productId: productId
    };
    const updateSet = {
      $inc: {
        inv_stock: stock
      },
      $set: {
        inv_location: location
      }
    }
    const options = {
      new: true,
      upsert: true
    };

    return await inventory.findByIdAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;