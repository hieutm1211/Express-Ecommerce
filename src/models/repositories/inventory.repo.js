const {
  inventory
} = require("../inventory.model")

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'Unknown',
}) => {
  return await inventory.create({
    inv_productId: productId,
    inv_shopId: shopId,
    inv_stock: stock,
    inv_location: location,
  });
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inv_productId: productId,
    inv_stock: { $gte: quantity }
  }
  const updateSet = {
    $inc: {
      inv_stock: -quantity,
    },
    $push: {
      inv_reservations: {
        quantity,
        cartId,
        createdOn: new Date()
      }
    }
  }
  const options = {
    upsert: true,
    new: true
  }

  return await inventory.updateOne(query, updateSet)
}

module.exports = {
  insertInventory,
  reservationInventory
}