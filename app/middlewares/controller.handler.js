// Fonction qui à pour rôle d'encapsuler les méthodes controllers afin de récupérer les retours d'erreurs.
export default (controller) => async (req, res, next) => {
  try{
    await controller(req, res, next);
  }catch(err){
    next(err);
  }
};
