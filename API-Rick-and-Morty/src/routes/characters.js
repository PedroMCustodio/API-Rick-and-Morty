const express = require('express');
const { getCharacters, getCharacterById, getMultipleCharacters } = require('../controllers/charactersController');
const { optionalAuth } = require('../middleware/auth');
const { checkQueryLimit } = require('../middleware/rateLimit');

const router = express.Router();

// Listar personagens (com rate limit)
router.get('/', optionalAuth, checkQueryLimit, getCharacters);

// Buscar múltiplos personagens (com rate limit)
router.get('/multiple', optionalAuth, checkQueryLimit, getMultipleCharacters);

// Buscar personagem por ID (com rate limit)
router.get('/:id', optionalAuth, checkQueryLimit, getCharacterById);

module.exports = router;