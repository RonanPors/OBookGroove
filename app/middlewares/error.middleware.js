export default (err, req, res, next) => {

  let { status, name } = err;

  const templateError = {
    name: err.name,
    message: err.message,
    status: err.status,
    cause: err.causeObj,
  };

  //Gestion des erreurs de validation JOI.
  if(name === 'ValidationError'){
    return res.status(400).json({error: {
      ...templateError,
      status: 400,
      message: err.details.map((detail) => detail.message),
    }});
  }

  //Gestion des erreurs d'authentification Spotify.
  if(name === 'FAILED_SPOTIFY_AUTH' || name === 'FAILED_BOOKS_SUGGEST'){
    // On supprime en cookies les tokens Spotify de l'utilisateur.
    res.clearCookie('access_token_spotify');
    res.clearCookie('refresh_token_spotify');

    return res.status(err.status).json({error: {
      ...templateError,
    }});
  }

  //Gestion des erreurs personnalisées.
  if(status){
    return res.status(err.status).json({error: {
      ...templateError,
    }});
  }

  //Si aucune erreur trouvée.
  if (!status) {
    err.status = 500;
  }

  if (status === 500) {
    return res.status(500).json({error: {
      ...templateError,
      message: 'Internal Server error, please contact the administrator',
    }});
  }

  return res.status(status || err.status || 500).json({error: {
    ...templateError,
  }});
};
