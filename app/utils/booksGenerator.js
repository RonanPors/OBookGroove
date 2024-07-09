import { getUserTopTraks } from "./spotifyUtils/getUserTopTraks.js";
//Services de suggestion de livres

export default {

  async init(cookies) {

    const tracks = getUserTopTraks(cookies);
    return tracks;
  },
};
