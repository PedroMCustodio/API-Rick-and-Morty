const rickMortyService = require('../services/rickMortyService');

const getCharacters = async (req, res, next) => {
  try {
    const { page = 1, name, status, species, gender } = req.query;
    
    const data = await rickMortyService.getCharacters(
      parseInt(page),
      name,
      status,
      species,
      gender
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

const getCharacterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID do personagem deve ser um número positivo',
      });
    }

    const data = await rickMortyService.getCharacterById(parseInt(id));

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
        message: 'Personagem não encontrado',
      });
    }
    next(error);
  }
};

const getMultipleCharacters = async (req, res, next) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro ids é obrigatório (ex: ?ids=1,2,3)',
      });
    }

    const idArray = ids.split(',').map(id => parseInt(id.trim()));
    
    if (idArray.some(id => isNaN(id) || id <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Todos os IDs devem ser números positivos',
      });
    }

    const data = await rickMortyService.getMultipleCharacters(idArray);

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

module.exports = {
  getCharacters,
  getCharacterById,
  getMultipleCharacters,
};