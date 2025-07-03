const prisma = require('../config/database');

const checkQueryLimit = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ip = req.ip || req.connection.remoteAddress;
    
    // Buscar logs de consulta do dia
    const whereClause = {
      ip: ip,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
      endpoint: {
        startsWith: '/api/characters',
      },
    };

    if (req.user) {
      whereClause.userId = req.user.id;
    } else {
      whereClause.userId = null;
    }

    const queryCount = await prisma.queryLog.count({
      where: whereClause,
    });

    const limit = req.user ? 10 : 3;
    
    if (queryCount >= limit) {
      return res.status(429).json({
        success: false,
        message: `Limite de ${limit} consultas por dia excedido`,
        queriesUsed: queryCount,
        queriesLimit: limit,
      });
    }

    // Registrar a consulta
    await prisma.queryLog.create({
      data: {
        userId: req.user?.id || null,
        ip: ip,
        endpoint: req.originalUrl,
      },
    });

    // Adicionar informações de limite no header da resposta
    res.set({
      'X-RateLimit-Limit': limit,
      'X-RateLimit-Remaining': limit - queryCount - 1,
      'X-RateLimit-Used': queryCount + 1,
    });

    next();
  } catch (error) {
    console.error('Erro no rate limiting:', error);
    next();
  }
};

module.exports = {
  checkQueryLimit,
};