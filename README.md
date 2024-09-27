# 🎵📚 obookgroove - Backend 📚🎵

obookgroove est une application qui propose des suggestions de livres basées sur les préférences musicales des utilisateurs, grâce à des intégrations avec l'API Spotify et l'API Mistral.

## 📖 Description du Projet

Ce dépôt contient la partie **back-end** de l'application **obookgroove**. Le serveur back-end est construit avec **Node.js** et **Express**, et gère les requêtes API pour récupérer et traiter les informations relatives aux livres et aux préférences musicales des utilisateurs. Les données sont stockées dans une base de données **PostgreSQL**.

## ⚙️ Fonctionnalités principales

- **API REST** pour la gestion des utilisateurs, des livres et des suggestions
- Intégration avec l'**API Spotify** pour obtenir les playlists des utilisateurs
- Suggestions de livres basées sur les genres musicaux
- **Authentification JWT** pour sécuriser l'accès des utilisateurs
- Documentation de l'API via **Swagger**
- Gestion et validation des données avec **Joi**
- Utilisation d'**Apollo Server** pour exposer une API GraphQL

## 📋 Prérequis pour le développement

Vous aurez besoin de configurer plusieurs API et services pour faire fonctionner l'application :

1. **API Spotify** : Créez un compte développeur Spotify et obtenez vos clés API :

   - [Spotify for Developers](https://developer.spotify.com/dashboard/)

2. **API Mistral** : Obtenez une clé API pour l'accès aux livres.

3. **API Google Books** : Créez une clé API depuis la [console développeur Google](https://console.cloud.google.com/).

4. **Service SMTP** : Utilisez un fournisseur SMTP pour l'envoi d'e-mails :

   - `HOST_EMAIL` : Le serveur SMTP (ex : `smtp.office365.com`)
   - `USER_EMAIL` : Votre adresse email
   - `PASS_EMAIL` : Le mot de passe pour l'authentification
   - `PORT_EMAIL` : Le port SMTP (ex : `587`)

5. **PostgreSQL** : Installez **PostgreSQL** pour gérer la base de données :

   - [Téléchargez PostgreSQL](https://www.postgresql.org/download/)

6. **Sqitch** : Installez **Sqitch** pour gérer les migrations de la base de données :
   - [Téléchargez Sqitch](https://sqitch.org/download/)

## 🚀 Lancement du projet

### 1️⃣ Cloner le dépôt

```
git clone <url-du-dépôt-backend>
```

### 2️⃣ Installer les dépendances

```
npm install
```

### 3️⃣ Configurer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
BASE_URL_CLIENT=http://localhost:5173
PORT=4000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=obookgroove
PG_USER=spedata
PG_PASSWORD=spedata
ACCESS_TOKEN_SECRET="Le gros secret de fou!"
REFRESH_TOKEN_SECRET="Le gros secret de fou!"
HOST_EMAIL='smtp.office365.com'
USER_EMAIL='adresse email'
PASS_EMAIL='mot de passe'
PORT_EMAIL=587
SECRET_KEY_RECAPTCHA='clé secret recaptcha'
CLIENT_KEY_RECAPTCHA='Clé client recaptcha'
SPOTIFY_APP_CLIENT_ID='client ID'
SPOTIFY_APP_CLIENT_SECRET='client Secret'
SPOTIFY_REDIRECT_URI='/member/books'
SPOTIFY_AUTHORIZE='https://accounts.spotify.com/authorize?'
SPOTIFY_TOKEN='https://accounts.spotify.com/api/token'
SPOTIFY_USER_TRACKS='https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10'
SPOTIFY_FEATURES_TRACKS=https://api.spotify.com/v1/audio-features/
MISTRAL_API_KEY='clé Mistral'
GOOGLEBOOK_API_KEY='clé googleBooks'
```

### 4️⃣ Créer et déployer la base de données

Une fois **Sqitch** installé, lancez le script `resetDB` pour créer et déployer la base de données :

```
npm run resetDB
```

Ce script va :

- **Réinitialiser** la base de données (si elle existe)
- **Appliquer** les migrations pour créer les tables
- **Peupler** la base de données avec des données de départ

### 5️⃣ Lancer le serveur

```
npm run dev
```

Le serveur sera lancé sur `http://localhost:4000`.

## 🛠️ Technologies utilisées

- **Node.js** : Serveur back-end
- **Express** : Framework web
- **Apollo Server** : API GraphQL
- **PostgreSQL** : Base de données
- **Knex.js** : Query builder pour PostgreSQL
- **JWT (jsonwebtoken)** : Authentification
- **Bcrypt** : Hachage de mots de passe
- **Joi** : Validation des données
- **Nodemailer** : Envoi d'e-mails
- **Axios** : Requêtes HTTP
- **CORS** : Gestion des politiques CORS
- **Dotenv** : Gestion des variables d'environnement
- **Cookie-parser** : Gestion des cookies
- **Pino HTTP** : Logger HTTP rapide
- **Sanitize-html** : Sécurisation des entrées utilisateur
- **GraphQL** : Langage de requête
- **Jest** : Tests unitaires
- **Mock-Knex** : Simulation des interactions avec la base de données
- **Swagger** : Documentation de l'API

## 📜 Scripts disponibles

- **start** : Démarre le serveur en mode production
  npm start
- **dev** : Démarre le serveur en mode développement
  npm run dev
- **resetDB** : Réinitialise et déploie la base de données avec **Sqitch**
  npm run resetDB
- **test** : Exécute les tests avec **Jest**
  npm run test

---

Profitez bien du projet ! 🎉
