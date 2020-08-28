const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/v1/login-controller');
const auth = require('../../middleware/auth');

// api/v1/login
router.post('/', loginController.loginAuth);

// obtiene el usuario autenticado
router.get('/', auth, loginController.userIsAuth);

module.exports = router;