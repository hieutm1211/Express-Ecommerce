'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const {
  authenticationV2
} = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));
//auth
router.use(authenticationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;