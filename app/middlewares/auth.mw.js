import { checkAccessTokenValidity } from "../auth/jwt.utils.js";

/**
 * MW qui va vérifier si l'utilisateur possède un token d'accès valide et non expiré
 * @param {Request} req - Requête venant de l'utilisateur
 * @param {Response} _ - Réponse inutilisée
 * @param {NextFunction} next - Fonction pour passer au prochain MW
 */
export default function authMiddleware(req, _, next) {

  const { accessTokenObg } = req.cookies;

  console.log('mw auth !1');

  if (!accessTokenObg) {
    req.auth = null;
    return next();
  }

  console.log('mw auth !2');

  // Vérifier que le token d'accès est valide ET non expiré
  req.auth = checkAccessTokenValidity(accessTokenObg, false);

  console.log('auth:', req.auth);

  next();

}
