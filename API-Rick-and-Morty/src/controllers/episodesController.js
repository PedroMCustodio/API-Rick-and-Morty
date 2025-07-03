const rickMortyService = require('../services/rickMortyService');

const getEpisodes = async (req, res, next) => {
  try {
    const { page = 1, name, episode } = req.query;
    
    const data = await rickMortyService.getEpisodes(
      parseInt(page),
      name,
      episode
    );

    res.json({
      success: true,
      data: data,
      meta: {
        authenticated: !!req.user,
        userId: req.user?.id || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEpisodeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID do episódio deve ser um número positivo',
      });
    }

    const data = await rickMortyService.getEpisodeById(parseInt(id));

    res.json({
      success: true,
      data: data,
      meta: {
        authenticated: !!req.user,
        userId: req.user?.id || null,
      },
    });
  } catch (error) {
    if (error.message.includes('404')) {
      return res.status(404).json({
        success: false,
        message: 'Episódio não encontrado',
      });
    }
    next(error);
  }
};

module.exports = {
  getEpisodes,
  getEpisodeById,
};