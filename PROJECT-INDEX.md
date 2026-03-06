# 📚 Index des Projets OnlyMatt

## 📱 Spread It (Standalone)
**Dossier**: `spread-it-wp copy/spread-it-standalone/`

- **Description**: Plateforme de publication multi-réseaux sociaux (OAuth)
- **Stack**: Node.js, Express, Axios
- **Plateformes**: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube
- **Production**: https://spread.onlymatt.ca
- **Deploy**: Render (auto-deploy from `master` branch)
- **Git**: Repository distinct
- **Config**: `.env.local` (non versioned), variables d'environnement sur Render

---

## 📧 Subscribe API
**Dossier**: `subscribe/`

- **Description**: API d'abonnement newsletter
- **Stack**: Serverless (Vercel Functions), Node.js
- **Base de données**: Turso (SQLite cloud)
- **Production**: https://subscribe.onlymatt.ca
- **Deploy**: Vercel (auto-deploy)
- **Git**: Repository distinct
- **Config**: Variables d'environnement Vercel

---

## 🔐 Auth & Payment System
**Dossier**: `auth-payment-system/`

- **Description**: Système d'authentification et paiement
- **Stack**: [À documenter]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 🍽️ Chaud Devant
**Dossier**: `chaud-devant/`

- **Description**: [Projet de restauration/cuisine]
- **Stack**: [À documenter]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 🎵 ForMusic
**Dossier**: `formusic_simple/`

- **Description**: Application musicale
- **Stack**: [À documenter]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 💪 Only Coach
**Dossier**: `only-coach/`

- **Description**: Plateforme de coaching
- **Stack**: [À documenter]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 🎬 Vidéothèque API
**Dossier**: `super-videotheque-api/`

- **Description**: API backend pour la vidéothèque
- **Stack**: [À documenter - probablement Node.js]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 🎬 Vidéothèque Frontend
**Dossier**: `super-videotheque-frontend/`

- **Description**: Interface utilisateur vidéothèque
- **Stack**: [À documenter - probablement React/Vue]
- **Production**: [À documenter]
- **Deploy**: [À documenter]
- **Git**: Repository distinct

---

## 📝 Notes Importantes

### Git Strategy
- Chaque projet a son propre `.git/`
- Ne PAS faire de commits cross-projets
- Vérifier la branche active avant commit

### Environnements
- Fichiers `.env` sont ignorés par Git (sécurité)
- Production: Variables d'environnement sur plateformes (Render, Vercel)
- Local: Fichiers `.env.local` ou `.env`

### Déploiement
- Spread It → Render (branch `master`)
- Subscribe → Vercel (branch `main`)
- Autres projets à documenter

---

**TODO**: Compléter les sections [À documenter] au fur et à mesure de l'utilisation des projets.

**Dernière mise à jour**: 19 février 2026
