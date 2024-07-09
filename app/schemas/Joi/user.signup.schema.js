import Joi from 'joi';

export default Joi.object({
  pseudo: Joi.string().min(2).max(30).required().messages({
    'string.base': 'Le pseudo doit être une chaîne de caractères.',
    'string.empty': 'Le pseudo ne peut pas être vide.',
    'string.min': 'Le pseudo doit contenir au moins 2 caractères.',
    'string.max': 'Le pseudo ne peut pas dépasser 30 caractères.',
    'any.required': 'Le pseudo est obligatoire.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Le format de l\'email est incorrect.',
    'string.empty': 'L\'email ne peut pas être vide.',
    'any.required': 'L\'email est obligatoire.',
  }),
  password: Joi.string()
    // Définir une longueur minimale de 8 caractères
    .min(8)
    // Doit contenir au moins une majuscule
    .pattern(new RegExp('(?=.*[A-Z])'))
    // Doit contenir au moins une minuscule
    .pattern(new RegExp('(?=.*[a-z])'))
    // Doit contenir au moins un chiffre
    .pattern(new RegExp('(?=.*[0-9])'))
    // Doit contenir au moins un caractère spécial
    .pattern(new RegExp('(?=.*[!@#$%^&*])'))
    .required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial.',
      'any.required': 'Le mot de passe est obligatoire.',
    }),
  confirmPassword: Joi.string()
    // Définir une longueur minimale de 8 caractères
    .min(8)
    // Doit contenir au moins une majuscule
    .pattern(new RegExp('(?=.*[A-Z])'))
    // Doit contenir au moins une minuscule
    .pattern(new RegExp('(?=.*[a-z])'))
    // Doit contenir au moins un chiffre
    .pattern(new RegExp('(?=.*[0-9])'))
    // Doit contenir au moins un caractère spécial
    .pattern(new RegExp('(?=.*[!@#$%^&*])'))
    .required().messages({
      'string.min': 'La confirmation du mot de passe doit contenir au moins 8 caractères.',
      'string.pattern.base': 'La confirmation du mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial.',
      'any.required': 'La confirmation du mot de passe est obligatoire.',
    }),
}).required();
