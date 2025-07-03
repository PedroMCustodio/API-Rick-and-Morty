const Joi = require('joi');

const userRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'string.empty': 'Email é obrigatório',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'string.empty': 'Email é obrigatório',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória',
  }),
});

const favoriteSchema = Joi.object({
  characterId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID do personagem deve ser um número',
    'number.integer': 'ID do personagem deve ser um número inteiro',
    'number.positive': 'ID do personagem deve ser positivo',
    'any.required': 'ID do personagem é obrigatório',
  }),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.details.map(detail => detail.message),
      });
    }
    next();
  };
};

module.exports = {
  validate,
  userRegisterSchema,
  userLoginSchema,
  favoriteSchema,
};