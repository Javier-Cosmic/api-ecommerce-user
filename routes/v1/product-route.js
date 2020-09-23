const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const productController =  require('../../controllers/v1/product-controller');

router.get('/', productController.showProducts);
router.post('/', auth, productController.createProduct);
router.delete('/:id', auth, productController.deleteProducts);

module.exports = router;