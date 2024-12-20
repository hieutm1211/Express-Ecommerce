'use strict';

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res);
  }

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: 'Codes found',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res);
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Codes found',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      })
    }).send(res);
  }

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Codes found',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      })
    }).send(res);
  }
}

module.exports = new DiscountController();