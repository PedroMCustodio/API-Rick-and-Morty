const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Dados já existem no sistema',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Erro de registro não encontrado no Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro não encontrado',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  // Erro JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};