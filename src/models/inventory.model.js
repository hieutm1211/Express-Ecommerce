const {
  Schema,
  model
} = require("mongoose");

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
  inv_productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  inv_location: {
    type: String,
    default: 'unknown'
  },
  inv_stock: {
    type: Number,
    required: true
  },
  inv_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  inV_reservations: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema)
}