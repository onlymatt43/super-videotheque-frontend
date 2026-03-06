# SUPER-VIDEOTHEQUE · Frontend

Interface React + TypeScript + Vite, mobile-first et inspirée de Netflix pour parcourir le catalogue SUPER-VIDEOTHEQUE, valider un code Payhip, lancer la lecture sécurisée Bunny.net et visionner les streams live OBS→RTMP→HLS.

## Fonctionnalités
- Landing page sombre avec formulaire de validation Payhip + email.
- Catalogue horizontal avec affiches, cartes glassmorphism et hover states.
- Auto-play d'un aperçu vidéo 4 secondes après l'apparition d'une carte (IntersectionObserver + hook custom).
- **Section Live** (`LiveSection.tsx`) : poll `GET /api/live` toutes les 3s, affiche le player HLS (hls.js) automatiquement quand un stream OBS est actif (~6s de latence).
- Intégration complète du backend :
  - `POST /api/payhip/validate` pour vérifier le code.
  - `GET /api/movies` pour afficher le catalogue (Turso).
  - `POST /api/rentals` & `GET /api/rentals/:id` pour générer / rafraîchir un lien signé Bunny.net.
  - `GET /api/live` pour détecter si un stream est actif.
- Lecteur vidéo responsive (Radix Dialog + HTML5 video `playsInline`).
- Zustand pour la session Payhip + location active + état des previews.
- TailwindCSS + thème night/ember pour un design moderne type Netflix.

## Déploiement Vercel

Auto-déployé à chaque push sur `main` via GitHub → Vercel.

```bash
git push origin main  # déclenche le redéploiement automatiquement
```

## Développement local

**Prérequis**
- Node.js LTS (recommandé: `22`, voir `.nvmrc`)

**Variables d'environnement**
Créer `.env.local` :
```
VITE_API_BASE_URL=https://super-videotheque-api.onrender.com
VITE_ADMIN_PASSWORD=<password>
VITE_LIVE_HLS_URL=https://meet.onlymatt.ca/hls/<stream_key>.m3u8
```

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
  components/         # UI réutilisable (carrousel, modale, lecteur, LiveSection)
  features/           # stores Zustand (catalog + session)
  hooks/              # hooks custom (prévisualisation différée)
  pages/              # Landing + Catalog
  types/              # contrats partagés (Movie, Rental...)
```

## Variables d'environnement (Vercel)

| Nom | Description |
| --- | --- |
| `VITE_API_BASE_URL` | URL du backend **sans `/api`** (ex: `https://super-videotheque-api.onrender.com`). |
| `VITE_ADMIN_PASSWORD` | Mot de passe admin pour l'interface de gestion. |
| `VITE_LIVE_HLS_URL` | URL du manifest HLS (ex: `https://meet.onlymatt.ca/hls/<stream_key>.m3u8`). |

## Expérience utilisateur
1. L'utilisateur saisit email + code Payhip → validation côté backend.
2. Une fois validé, redirection vers `/catalog` avec chargement des films.
3. Chaque carte lance un aperçu vidéo 4 secondes après être visible.
4. Bouton "Regarder" → création/rafraîchissement d'une location → récupération du lien signé Bunny.net → lecture mobile-friendly.
5. Section Live : affiche automatiquement le stream en cours (~6s de latence) quand OBS streame via RTMP.

## Architecture Live Streaming

```
OBS → RTMP (rtmp://meet.onlymatt.ca/live/<stream_key>)
    → nginx-rtmp (VPS Hostinger, Ubuntu)
    → HLS segments (/var/www/hls/)
    → HTTPS (meet.onlymatt.ca/hls/<stream_key>.m3u8)
    → API Render HEAD check → {"live": true/false}
    → Frontend LiveSection (hls.js player, ~6s latence)
```

**Config OBS requise :**
- Keyframe interval : `2` secondes
- Bitrate : 2500-4000 kbps
- Profil : main

## Idées d'évolution
1. Authentification complète (JWT) + profils.
2. Multiples carrousels (genres, recommandations personnalisées).
3. Persist de la session/rentals + gestion offline.
4. Chat live intégré durant les streams.
