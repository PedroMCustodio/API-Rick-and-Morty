const express = require('express');
const { getLocations } = require('../controllers/locationsController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Listar locações
router.get('/', optionalAuth, getLocations);

module.exports = router;