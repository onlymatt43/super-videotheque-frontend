# SUPER-VIDEOTHEQUE · Frontend

Interface React + TypeScript + Vite, mobile-first et inspirée de Netflix pour parcourir le catalogue SUPER-VIDEOTHEQUE, valider un code Payhip, lancer la lecture sécurisée Bunny.net et visionner les streams live OBS→RTMP→HLS.

## Fonctionnalités
- Landing page sombre avec formulaire de validation Payhip + email.
- Footer légal global avec liens: Terms, Privacy, Refund, 18+ Notice, 2257 Compliance.
- Catalogue horizontal avec affiches, cartes glassmorphism et hover states.
- Auto-play d'un aperçu vidéo 4 secondes après l'apparition d'une carte (IntersectionObserver + hook custom).
- **Section Live** (`LiveSection.tsx`) : poll `GET /api/live` toutes les 3s, affiche le player HLS (hls.js) automatiquement quand un stream OBS est actif (~6s de latence). Quand le stream est actif, un bouton **"Rejoindre la salle"** apparaît et ouvre `https://meet.jit.si/onlymatt-live` dans un nouvel onglet (pas d'iframe, pas de limite de temps).
- Intégration complète du backend :
  - `POST /api/payhip/validate` pour vérifier le code.
  - `GET /api/movies` pour afficher le catalogue (Turso).
  - `POST /api/rentals` & `GET /api/rentals/:id` pour générer / rafraîchir un lien signé Bunny.net.
  - `GET /api/live` pour détecter si un stream est actif.
- Lecteur vidéo responsive (Radix Dialog + HTML5 video `playsInline`).
- Zustand pour la session Payhip + location active + état des previews.
- TailwindCSS + thème night/ember pour un design moderne type Netflix.

## Conformité paiement et legal
- Routes légales publiques:
  - `/terms`
  - `/privacy`
  - `/refund`
  - `/adult-notice`
  - `/compliance`
- Les mentions de transparence descriptor sont affichées sous l'action de paiement:
  - CCBILL.COM pour la facturation CCBill
  - GUARDARIAN/BANXA pour le flux carte via NOWPayments
- Identité business affichée dans le footer légal:
  - Mathieu Courchesne - OM43
  - theo43.team
  - contact@theom43.team
  - +1 929 812 1653

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
VITE_LIVE_HLS_URL=https://meet.onlymatt.ca/hls/<stream_key>.m3u8
VITE_LIVE_FALLBACK_URL=https://iframe.mediadelivery.net/embed/552081/<video_id>?autoplay=true&loop=true&muted=true
VITE_LIVE_FALLBACK_URLS=https://iframe.mediadelivery.net/embed/...?... , https://youtube.com/embed/... , https://iframe.mediadelivery.net/embed/...?...
VITE_LIVE_FALLBACK_PRIVATE_API_URL=https://chaud-devant.onlymatt.ca/api/get-videos
VITE_LIVE_FALLBACK_PRIVATE_REFRESH_MINUTES=25
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
| `VITE_LIVE_HLS_URL` | URL du manifest HLS (ex: `https://meet.onlymatt.ca/hls/<stream_key>.m3u8`). |
| `VITE_LIVE_FALLBACK_URL` | URL de la vidéo Bunny affichée quand pas de live actif. |
| `VITE_LIVE_FALLBACK_URLS` | Liste d'URLs fallback séparées par virgules (ou retours ligne), choisies aléatoirement côté frontend sans répétition immédiate. |
| `VITE_LIVE_FALLBACK_PRIVATE_API_URL` | Endpoint JSON (ex: `get-videos`) pour tirer des URLs signées. Le frontend privilégie les vidéos `locked=true` puis en choisit une au hasard. |
| `VITE_LIVE_FALLBACK_PRIVATE_REFRESH_MINUTES` | Intervalle (minutes) de rafraîchissement automatique des URLs privées signées. Par défaut: `25`. |

### Auth admin (backend)
- Le login admin frontend utilise un code TOTP 6 chiffres (app sur cell), validé côté API via `POST /api/admin/auth/login`.
- Variables backend requises :
  - `ADMIN_TOTP_SECRET` : secret TOTP (base32) utilisé par ton app mobile.
  - `ADMIN_SESSION_SECRET` : secret de signature des tokens de session admin.
  - `ADMIN_SESSION_TTL_MINUTES` : durée d'expiration du token admin (par défaut `480`).

## Expérience utilisateur
1. L'utilisateur saisit email + code Payhip → validation côté backend.
2. Une fois validé, redirection vers `/catalog` avec chargement des films.
3. Chaque carte lance un aperçu vidéo 4 secondes après être visible.
4. Bouton "Regarder" → création/rafraîchissement d'une location → récupération du lien signé Bunny.net → lecture mobile-friendly.
5. Section Live : affiche automatiquement le stream en cours (~6s de latence) quand OBS streame via RTMP. Si pas de live, affiche la vidéo fallback Bunny (`VITE_LIVE_FALLBACK_URL`). Quand live actif, bouton "Rejoindre la salle" ouvre Jitsi dans un nouvel onglet.

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
