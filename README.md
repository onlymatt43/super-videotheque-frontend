# SUPER-VIDEOTHEQUE · Frontend

Interface React + TypeScript + Vite, mobile-first et inspirée de Netflix pour parcourir le catalogue SUPER-VIDEOTHEQUE, valider un code Payhip et lancer la lecture sécurisée Bunny.net.

## Fonctionnalités
- Landing page sombre avec formulaire de validation Payhip + email.
- Catalogue horizontal avec affiches, cartes glassmorphism et hover states.
- Auto-play d'un aperçu vidéo 4 secondes après l'apparition d'une carte (IntersectionObserver + hook custom).
- Intégration complète du backend :
	- `POST /api/payhip/validate` pour vérifier le code.
	- `GET /api/movies` pour afficher le catalogue MongoDB.
	- `POST /api/rentals` & `GET /api/rentals/:id` pour générer / rafraîchir un lien signé Bunny.net.
- Lecteur vidéo responsive (Radix Dialog + HTML5 video `playsInline`).
- Zustand pour la session Payhip + location active + état des previews.
- TailwindCSS + thème night/ember pour un design moderne type Netflix.

## Déploiement Vercel

Ce frontend est déployé en tant que site statique sur Vercel.

**URL de production:** https://frontend-p7cuqder5-matts-projects-77a3636c.vercel.app

**Configuration requise:**

**Déploiement:**
```bash
cd frontend
vercel --prod
```
Deployment note (Feb 2026): Public previews are now served from the API’s DB only; no Bunny public keys in runtime. A fresh deploy ensures clients load the updated endpoint and signed URLs.

Le build Vite est automatique via `vercel build`.

Note (Feb 2026): embed mobile optimisé (`?embed=1` + `100svh`). Si le projet Vercel est connecté au repo GitHub, chaque push déclenche un redeploy automatique.

## Développement local

**Prérequis**
- Node.js LTS (recommandé: `22`, voir `.nvmrc`)

**Variables d'environnement**
- `VITE_API_BASE_URL` (ex: `https://super-videotheque-api.onrender.com/api`)

**Démarrage**
```bash
nvm use || true
npm install
npm run dev
```

## Structure
```
src/
	api/                # appels REST (axios)
	components/         # UI réutilisable (carrousel, modale, lecteur)
	features/           # stores Zustand (catalog + session)
	hooks/              # hooks custom (prévisualisation différée)
	pages/              # Landing + Catalog
	types/              # contrats partagés (Movie, Rental...)
```

## Variables d'environnement (Vercel)

| Nom | Description |
| --- | --- |
| `VITE_API_BASE_URL` | URL du backend (ex: `https://<ton-service>.onrender.com/api`). |

## Expérience utilisateur
1. L'utilisateur saisit email + code Payhip → validation côté backend.
2. Une fois validé, redirection vers `/catalog` avec chargement des films.
3. Chaque carte lance un aperçu vidéo 4 secondes après être visible.
4. Bouton "Regarder" → création/rafraîchissement d'une location → récupération du lien signé Bunny.net → lecture mobile-friendly.

## Idées d'évolution
1. Authentification complète (JWT) + profils.
2. Multiples carrousels (genres, recommandations personnalisées).
3. Persist de la session/rentals + gestion offline.

