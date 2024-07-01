import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

/**
 * Générer un Access Token valide et signé
 * @param {object} user - Objet user contenant les informations de l'utilisateur
 * @returns - JWT valide et signé
 */
export const createAccessToken = ({ id }) => jwt.sign({
  sub: id,
}, ACCESS_TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '15m',
});

/**
 * Générer un Refresh Token valide et signé
 * @param {object} user - Objet user contenant les informations de l'utilisateur
 * @returns - JWT valide et signé
 */
export const createRefreshToken = ({ id }) => jwt.sign({
  sub: id,
}, REFRESH_TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '60m',
});

/**
 * Vérifie si le token passé en argument est expiré ou non
 * @param {object} token - Objet qui est égal au token
 * @returns
 */
function checkExpirationToken(token) {

  const tokenExp = token.exp;
  const nowInSec = (Math.floor(Date.now()) / 1000);

  // Si le token est expiré
  if (nowInSec > tokenExp) return null;

  // Si le token n'est pas expiré
  return token;
}

/**
 * Vérification de la validation et de l'expiration du refresh token de l'utilisateur
 * @param {*} refreshToken - refresh token
 * @returns
 */
function checkRefreshTokenValidity(refreshToken) {

  // Vérifier si le token de refresh est valide ET non expiré
  const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

  // Si le token de refresh est non valide et/ou expiré, l'utilisateur sera considéré comme non authentifié
  /*
    Avec un système pareil, le refresh token peut avoir une expiration très longue
    car il est regénéré à chaque fois du moment que les deux tokens sont valide
  */
  if (!decodedRefreshToken) return null;

  // Si le token de refresh est valide ET non expiré
  return refreshToken;

}

/**
 * Vérification de la validation et de l'expiration du token d'accès de l'utilisateur
 * @param {object} accessToken - Token d'accès de l'utilisateur
 * @returns
 */
export function checkAccessTokenValidity(accessToken) {

  // Vérifier seulement si le token d'accès est valide ou non
  const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

  // Retourne null si le token d'accès est valide mais expiré
  if (!decodedAccessToken) return null;

  // Retourne le token décodé s'il est valide et non expiré
  return decodedAccessToken;

}
