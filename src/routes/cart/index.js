'use strict';

const express = require('express');
const {
  authenticationV2
} = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();

router.post('', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.update));
router.delete('', asyncHandler(cartController.delete));
router.get('', asyncHandler(cartController.listToCart));

module.exports = router;