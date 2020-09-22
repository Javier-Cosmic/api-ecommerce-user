const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user-controller');
const auth = require('../../middleware/auth');
const { upload } = require('../../multer');

router.post('/', auth, upload, userController.createUser);
router.put('/:id', auth, upload, userController.updateUser);
router.get('/', auth, userController.getUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
