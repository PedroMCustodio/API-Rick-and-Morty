const express = require('express');
const { getEpisodes, getEpisodeById } = require('../controllers/episodesController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Listar episódios
router.get('/', optionalAuth, getEpisodes);

// Buscar episódio por ID
router.get('/:id', optionalAuth, getEpisodeById);

module.exports = router;