import Joi from 'joi';

export default Joi.object({
  email: Joi.string().email().required(),
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
    .required()
    .messages({
      'password.pattern': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
      'password.min': 'Le mot de passe doit contenir au moins 8 caractères.'}),
}).required().message({'missing.data':'Aucune donnée n\'a été renseignée'});
