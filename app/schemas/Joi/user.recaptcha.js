import Joi from 'joi';

export default Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Le token recaptcha ne peut pas être vide.',
    'any.required': 'Le token recaptcha est obligatoire.',
  }),
}).required();
