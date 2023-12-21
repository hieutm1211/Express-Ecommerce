const {
  Schema,
  model
} = require("mongoose");

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
  discount_name: {
    type: String,
    required: true
  },
  discount_description: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    default: 'fixed_amount'
  },
  discount_value: {
    type: Number,
    required: true
  },
  discount_code: {
    type: String,
    required: true
  },
  discount_start_date: {
    type: Date,
    required: true
  },
  discount_end_date: {
    type: Date,
    required: true
  },
  max_discount_codes: {
    type: Number,
    required: true
  },
  used_discount_codes: {
    type: Number,
    required: true
  },
  discount_users: {
    type: Array,
    default: []
  },
  max_codes_can_use_per_user: {
    type: Number,
    required: true
  },
  discount_min_order_value: {
    type: Number,
    required: true
  },
  discount_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  },

  discount_is_active: {
    type: Boolean,
    default: true
  },
  discount_applied_to: {
    type: String,
    required: true,
    enum: ['all', 'specific']
  },
  discount_product_ids: {
    type: Array,
    default: []
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema)
}