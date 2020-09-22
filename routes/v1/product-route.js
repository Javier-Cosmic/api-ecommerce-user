const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const productController =  require('../../controllers/v1/product-controller');
const { upload } = require('../../multer');

router.get('/', productController.showProducts);
router.post('/', auth, upload, productController.createProduct);
router.delete('/:id', auth, productController.deleteProducts);

module.exports = router;