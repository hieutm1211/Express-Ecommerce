'use strict';

const {
  BadRequestError,
  NotFoundError
} = require("../core/error.response");
const {
  discount
} = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists
} = require("../models/repositories/discount.repo");
const {
  convertToObjectIdMongodb
} = require("../utils");
const {
  findAllProducts
} = require("./product.service.v2");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_applied_to,
      discount_product_ids,
      shopId
    } = payload;
    
    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError('Start date must be smaller than end date');
    }

    const newDiscount = await discount.create({
      ...payload,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId: shopId,
      discount_product_ids: discount_applied_to === 'all' ? [] : discount_product_ids
    });

    return newDiscount;
  }

  static async updateDiscountCode() {
    //TODO:
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page
  }) {
    console.log('code', code);
    console.log('shopId', shopId);
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    }).lean();
    console.log('foundDiscount', foundDiscount);
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not found');
    }

    const {
      discount_applied_to,
      discount_product_ids
    } = foundDiscount;
    let products;

    if (discount_applied_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applied_to === 'specific') {
      products = await findAllProducts({
        filter: {
          __id: {
            $in: discount_product_ids
          },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    limit,
    page,
    shopId
  }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit,
      page,
      filter: {
        discount_shop_id: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount
    });

    return discounts;
  }

  static async getDiscountAmount({
    codeId,
    userId,
    shopId,
    products
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      }
    })

    if (!foundDiscount) throw new NotFoundError('discount not found');

    const {
      discount_is_active,
      max_codes_can_use_per_user,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_value,
      discount_type
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError('discount not active');
    if (!max_codes_can_use_per_user) throw new NotFoundError('discount are out');

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))
      throw new NotFoundError('discount code has expired');

    let totalOrder = 0;
    
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`discount value min is ${discount_min_order_value}`);
      }
    }

    if (max_codes_can_use_per_user > 0) {
      //TODO:
    }

    const amount = discount_type === 'fix_amount' ? discount_value : totalOrder * (discount_value / 100);
    
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    }
  }

  static async deleteDiscountCode({
    shopId,
    codeId
  }) {
    //METHOD: Move deleted record to another schema , don't delete it permanently
    return await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
  }

  static async cancelDiscountCode({
    codeId,
    shopId,
    userId
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      }
    })

    if (!foundDiscount) throw new NotFoundError('discount not found');

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users: userId,
      },
      $inc: {
        max_discount_codes: 1,
        used_discount_codes: -1
      }
    });

    return result;
  }
}

module.exports = DiscountService;