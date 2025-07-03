const express = require('express');
const authRoutes = require('./auth');
const charactersRoutes = require('./characters');
const favoritesRoutes = require('./favorites');
const episodesRoutes = require('./episodes');
const locationsRoutes = require('./locations');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Rotas da API
router.use('/auth', authRoutes);
router.use('/characters', charactersRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/episodes', episodesRoutes);
router.use('/locations', locationsRoutes);

module.exports = router;