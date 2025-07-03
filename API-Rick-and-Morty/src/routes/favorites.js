const express = require('express');
const { 
  addFavorite, 
  getFavorites, 
  updateFavorite, 
  removeFavorite,
  getFavoriteEpisodes,
  getAllFavoritesEpisodes
} = require('../controllers/favoritesController');
const { authenticate } = require('../middleware/auth');
const { validate, favoriteSchema } = require('../validators');

const router = express.Router();

// Todas as rotas de favoritos requerem autenticação
router.use(authenticate);

// Listar favoritos
router.get('/', getFavorites);

// Adicionar favorito
router.post('/', validate(favoriteSchema), addFavorite);

// Atualizar favorito
router.put('/:id', validate(favoriteSchema), updateFavorite);

// Remover favorito
router.delete('/:id', removeFavorite);

// Episódios de cada favorito
router.get('/episodes', getFavoriteEpisodes);

// Episódios únicos de todos os favoritos
router.get('/episodes/unique', getAllFavoritesEpisodes);

module.exports = router;