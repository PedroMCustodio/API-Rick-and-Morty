const rickMortyService = require('../services/rickMortyService');

const getLocations = async (req, res, next) => {
  try {
    const { page = 1, name, type, dimension } = req.query;
    
    const data = await rickMortyService.getLocations(
      parseInt(page),
      name,
      type,
      dimension
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

module.exports = {
  getLocations,
};