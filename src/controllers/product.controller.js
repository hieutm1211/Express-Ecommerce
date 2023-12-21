const {
  SuccessResponse
} = require("../core/success.response")
const ProductService = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.service.v2");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Product successfully',
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res);
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product successfully',
      metadata: await ProductFactoryV2.updateProduct(req.body.product_type, req.params.product_id, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res);
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product successfully',
      metadata: await ProductFactoryV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res);
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish Product successfully',
      metadata: await ProductFactoryV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res);
  }

  /**
   * @description
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   * @returns
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list draft successfully',
      metadata: await ProductFactoryV2.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }

  getAllPublishesForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list published successfully',
      metadata: await ProductFactoryV2.findAllPublishesForShop({
        product_shop: req.user.userId
      })
    }).send(res);
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list search successfully',
      metadata: await ProductFactoryV2.searchProducts(req.params)
    }).send(res);
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'get list product successfully',
      metadata: await ProductFactoryV2.findAllProducts(req.query)
    }).send(res);
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'get product successfully',
      metadata: await ProductFactoryV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res);
  }
}

module.exports = new ProductController();