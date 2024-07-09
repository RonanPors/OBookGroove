import Joi from 'joi';

export default Joi.object({
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
      'string.min': 'La confirmation du mot de passe doit contenir au moins 8 caractères.',
      'string.pattern.base': 'La confirmation du mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial.',
      'any.required': 'La confirmation du mot de passe est obligatoire.',
    }),
}).required();
