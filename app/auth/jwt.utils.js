import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

/**
 * Générer un Access Token valide et signé
 * @param {object} claims - Objet contenant les informations de l'utilisateur
 * @returns - JWT valide et signé
 */
export const createAccessToken = (claims) => jwt.sign({
  claims,
}, ACCESS_TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '15m',
});

/**
 * Générer un Refresh Token valide et signé
 * @param {object} claims - Objet contenant les informations de l'utilisateur
 * @returns - JWT valide et signé
 */
export const createRefreshToken = (claims) => jwt.sign({
  claims,
}, REFRESH_TOKEN_SECRET, {
  algorithm: 'HS256',
  expiresIn: '60m',
});

/**
 * Vérifie si le token passé en argument est expiré ou non
 * @param {object} decodedToken - Objet qui est égal au token décodé
 * @returns
 */
export function checkExpirationToken(decodedToken) {

  const tokenExp = decodedToken.exp;
  const nowInSec = (Math.floor(Date.now()) / 1000);

  // Si le token est expiré
  if (nowInSec > tokenExp) return null;

  // Si le token n'est pas expiré
  return decodedToken;
}

/**
 * Vérification de la validation et de l'expiration du refresh token de l'utilisateur
 * @param {string} refreshToken - refresh token
 * @param {boolean} ignoreExpiration - La vérification doit-elle prendre ne compte l'expiration du token ?
 * @returns
 */
export function checkRefreshTokenValidity(refreshToken, ignoreExpiration) {

  // Vérifier si le token de refresh est valide ET non expiré
  const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, {
    ignoreExpiration,
  });

  // Si le token de refresh est non valide et/ou expiré, l'utilisateur sera considéré comme non authentifié
  /*
    Avec un système pareil, le refresh token peut avoir une expiration très longue
    car il est regénéré à chaque fois du moment que les deux tokens sont valide
  */
  if (!decodedRefreshToken) return null;

  // Si le token de refresh est valide ET non expiré
  return decodedRefreshToken;

}

/**
 * Vérification de la validation et de l'expiration du token d'accès de l'utilisateur
 * @param {string} accessToken - Token d'accès de l'utilisateur
 * @param {boolean} ignoreExpiration - La vérification doit-elle prendre ne compte l'expiration du token ?
 * @returns
 */
export function checkAccessTokenValidity(accessToken, ignoreExpiration) {

  // Vérifier que la chaîne contient bien 'Bearer '
  const bearerIsPresent = accessToken.startsWith('Bearer ');
  if (!bearerIsPresent) return null;

  // Séparer le 'Bearer' du token 7
  const newAccessToken = accessToken.slice(7);

  // Vérifier seulement si le token d'accès est valide ou non
  const decodedAccessToken = jwt.verify(newAccessToken, ACCESS_TOKEN_SECRET, {
    ignoreExpiration,
  });

  // Retourne null si le token d'accès est valide mais expiré
  if (!decodedAccessToken) return null;

  // Retourne le token décodé s'il est valide et non expiré
  return decodedAccessToken;

}

/**
 * Vérifier si deux objets sont les mêmes
 * @param {object} claim1 - Premier objet à comparer
 * @param {object} claim2 - Deuxième objet à comparer
 * @returns
 */
export const claimsTokenVerify = (claim1, claim2) =>
  (JSON.stringify(claim1) === JSON.stringify(claim2));
