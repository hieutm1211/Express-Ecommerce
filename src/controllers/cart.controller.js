const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create a new Cart',
      metadata: await CartService.addToCart(req.body)
    }).send(res);
  }
  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update a Cart',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res);
  }
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Cart',
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res);
  }
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Cart',
      metadata: await CartService.getListUserCart(req.query)
    }).send(res);
  }
}

module.exports = new CartController();