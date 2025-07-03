const prisma = require('../config/database');
const rickMortyService = require('../services/rickMortyService');

const addFavorite = async (req, res, next) => {
  try {
    const { characterId } = req.body;
    const userId = req.user.id;

    // Verificar se o usuário já tem 3 favoritos
    const favoritesCount = await prisma.favorite.count({
      where: { userId },
    });

    if (favoritesCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Você já possui o máximo de 3 personagens favoritos',
      });
    }

    // Verificar se o personagem existe na API
    try {
      const character = await rickMortyService.getCharacterById(characterId);
      
      // Criar favorito
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          characterId,
          characterName: character.name,
          characterImage: character.image,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Personagem adicionado aos favoritos',
        data: favorite,
      });
    } catch (error) {
      if (error.message.includes('404')) {
        return res.status(404).json({
          success: false,
          message: 'Personagem não encontrado',
        });
      }
      throw error;
    }
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Personagem já está nos seus favoritos',
      });
    }
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: favorites,
      count: favorites.length,
    });
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { characterId } = req.body;
    const userId = req.user.id;

    // Verificar se o favorito existe e pertence ao usuário
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingFavorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorito não encontrado',
      });
    }

    // Verificar se o novo personagem existe na API
    try {
      const character = await rickMortyService.getCharacterById(characterId);
      
      // Atualizar favorito
      const updatedFavorite = await prisma.favorite.update({
        where: { id },
        data: {
          characterId,
          characterName: character.name,
          characterImage: character.image,
        },
      });

      res.json({
        success: true,
        message: 'Favorito atualizado com sucesso',
        data: updatedFavorite,
      });
    } catch (error) {
      if (error.message.includes('404')) {
        return res.status(404).json({
          success: false,
          message: 'Personagem não encontrado',
        });
      }
      throw error;
    }
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Você já possui este personagem nos favoritos',
      });
    }
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o favorito existe e pertence ao usuário
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorito não encontrado',
      });
    }

    await prisma.favorite.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Favorito removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

const getFavoriteEpisodes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });

    if (favorites.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'Nenhum favorito encontrado',
      });
    }

    const characterIds = favorites.map(f => f.characterId);
    const characters = await rickMortyService.getMultipleCharacters(characterIds);
    
    const charactersArray = Array.isArray(characters) ? characters : [characters];
    
    const episodeStats = charactersArray.map(character => ({
      characterId: character.id,
      characterName: character.name,
      episodeCount: character.episode.length,
      episodes: character.episode,
    }));

    res.json({
      success: true,
      data: episodeStats,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFavoritesEpisodes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });

    if (favorites.length === 0) {
      return res.json({
        success: true,
        data: {
          totalUniqueEpisodes: 0,
          episodes: [],
        },
        message: 'Nenhum favorito encontrado',
      });
    }

    const characterIds = favorites.map(f => f.characterId);
    const characters = await rickMortyService.getMultipleCharacters(characterIds);
    
    const charactersArray = Array.isArray(characters) ? characters : [characters];
    
    // Coletar todos os episódios únicos
    const allEpisodes = new Set();
    charactersArray.forEach(character => {
      character.episode.forEach(episodeUrl => {
        allEpisodes.add(episodeUrl);
      });
    });

    const uniqueEpisodes = Array.from(allEpisodes);

    res.json({
      success: true,
      data: {
        totalUniqueEpisodes: uniqueEpisodes.length,
        episodes: uniqueEpisodes,
        charactersInvolved: charactersArray.map(c => ({
          id: c.id,
          name: c.name,
          episodeCount: c.episode.length,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  updateFavorite,
  removeFavorite,
  getFavoriteEpisodes,
  getAllFavoritesEpisodes,
};