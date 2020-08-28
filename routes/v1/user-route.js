const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user-controller');
const auth = require('../../middleware/auth');

router.post('/', userController.createUser);
router.put('/:id', auth, userController.updateUser); 
router.get('/', auth, userController.getUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;