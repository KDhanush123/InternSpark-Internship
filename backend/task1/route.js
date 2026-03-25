const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductBySno,
  updateProduct,
  deleteProduct
} = require('./controller');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:sno')
  .get(getProductBySno)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
