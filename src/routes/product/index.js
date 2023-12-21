'use strict';

const express = require('express');
const {
  authenticationV2
} = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const ProductController = require('../../controllers/product.controller');
const productController = require('../../controllers/product.controller');
const router = express.Router();


router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct));
router.get('', asyncHandler(ProductController.findAllProducts));
router.get('/:product_id', asyncHandler(ProductController.findProduct))
//auth
router.use(authenticationV2);

router.post('', asyncHandler(ProductController.createProduct));
router.patch('/:product_id', asyncHandler(ProductController.updateProduct));
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop));


router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get('/publishes/all', asyncHandler(productController.getAllPublishesForShop));


module.exports = router;