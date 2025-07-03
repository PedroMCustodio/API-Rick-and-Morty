const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, userRegisterSchema, userLoginSchema } = require('../validators');

const router = express.Router();

// Cadastro de usuário
router.post('/register',validate(userRegisterSchema), register);

// Login
router.post('/login',validate(userLoginSchema), login);

// Perfil do usuário (protegido)
router.get('/profile', authenticate, getProfile);

module.exports = router;