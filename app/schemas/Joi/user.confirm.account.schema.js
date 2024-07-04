import Joi from 'joi';

export default Joi.object({
  userId: Joi.number().required(),
  confirmToken: Joi.string().required(),
}).required();
