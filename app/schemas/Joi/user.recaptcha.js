import Joi from 'joi';

export default Joi.object({
  token: Joi.string().required(),
}).required();
