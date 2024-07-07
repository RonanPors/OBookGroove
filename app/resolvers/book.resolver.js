import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';

export default {
  users: async ({ id }) => await userHasBookDatamapper.findByBook(id),
};
