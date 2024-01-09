require('dotenv').config();
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const {
  default: helmet
} = require('helmet')

const app = express();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// require('../test/inventory.test');
// const productTest = require('../test/product.test');

// productTest.purchaseProduct('product:001', 10);

require('./dbs/init.mongodb');

app.use('', require('./routes'));

//handling error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
})

module.exports = app;