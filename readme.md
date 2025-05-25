# 🎬 Watchlist

**Watchlist** est une application de bureau développée avec **Electron**, permettant de gérer une liste de films à voir et de favoris. Elle s'appuie sur une base de données **SQLite** locale et interagit avec l'API publique de **The Movie Database (TMDB)**.

---

## 🚀 Fonctionnalités

- 🔍 Recherche de films via l'API TMDB
- ⭐ Ajout de films aux favoris
- 🕒 Gestion d'une watchlist (films à voir)
- 🧠 Stockage local des données (SQLite)
- 📦 Application empaquetée en `.exe` pour Windows

---

## 🛠️ Technologies utilisées

- [Electron](https://www.electronjs.org/)
- [SQLite3](https://www.sqlite.org/index.html)
- [The Movie Database API](https://www.themoviedb.org/documentation/api)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [axios](https://axios-http.com/)

---

## 🤝 Travail en groupe

Le projet a été entièrement créé et maintenu en collaboration sur [GitHub](https://github.com/naveoo/WatchList).

---

## 🗂️ Structure du projet

- `src/`
  - `main/`
    - `main.js` : Point d'entrée Electron
  - `renderer/`
    - `assets/`
      - `logo.png`
      - `placeholder_not_found.png`
    - `components/`
      - `header.html` : Barre de navigation injectée dynamiquement dans les pages
    - `renderers/`
      - `index_renderer.js`
      - `details_renderer.js`
      - `favorites_renderer.js`
      - `watchlist_renderer.js`
      - `timesetter_renderer.js`
    - `styles/`
      - `style.css`
    - `index.html`
    - `details.html`
    - `favorites.html`
    - `watchlist.html`
    - `timesetter.html`
  - `data.db` : Base de données de test utilisée en mode développement

- `data/`
  - `data.db` : Base de données utilisée lors de la compilation

- `dist/`
  - `builder-debug.yml` : Fichier de débogage généré par défaut lors du build Electron
  - `Watchlist Setup 1.3.1.exe` : Fichier exécutable Windows généré après build

- `node_modules/`
  - `...` : Modules nécessaires au fonctionnement de l'application

- `.env` : Variables d’environnement, incluant la clé API TMDB  
- `icon.ico` : Icône de l'application utilisée pour la compilation  
- `package-lock.json` : Verrouillage des dépendances installées  
- `package.json` : Fichier de configuration principal de l’application

---

## 📦 Compilation

L'application peut être empaquetée au format `.exe` via `electron-builder`. Une fois le build effectué (`npm run build`), l'exécutable est disponible dans le dossier `dist/`.

---

## 👥 Auteurs

- **Legris Ethan**
- **Znatchko-Yavorsky Gabriel**
- **Dornias Allistair**

Projet réalisé dans le cadre du module final de L1 info – 2025.