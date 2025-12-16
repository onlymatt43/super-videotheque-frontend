# SUPER-VIDEOTHEQUE Frontend Plan

## Stack
- Vite + React + TypeScript
- React Router for views
- Zustand for lightweight state (catalog + session)
- Axios for API calls
- Tailwind CSS + custom tokens for Netflix-like dark theme
- React Player (or HTML5 video) with native controls optimized for mobile

## Key UX Blocks
1. **Landing (Code Entry)**
   - Fullscreen hero with gradient overlay + Payhip code form
   - On submit: call backend `/api/payhip/validate` then persist session state and move to catalog view
2. **Catalog View**
   - Horizontal scrollable carousels (single for now, extendable) with movie posters
   - Hover (desktop) / focus (mobile) shows metadata card
   - Auto-play preview: when a card becomes visible for ≥4s, trigger preview video overlay using provided Bunny path (simulate with sample). Use `IntersectionObserver` + timeout
3. **Player View / Modal**
   - On CTA “Regarder”, call backend `/api/rentals` or `/api/rentals/:id` to fetch signed Bunny URL
   - Video loads in responsive container, uses HTML5 video with inline playback allowed (`playsInline`)

## Directory Layout
```
frontend/
  src/
    api/
      client.ts         # axios instance w/ baseURL
      hooks.ts          # react-query style hooks (custom)
    components/
      Carousel.tsx
      MovieCard.tsx
      PreviewPlayer.tsx
      VideoPlayer.tsx
      PayhipForm.tsx
      Layout.tsx
    features/
      catalog/
        useCatalog.ts   # Zustand slice
      session/
        useSession.ts   # stores validated code + rental ids
    pages/
      Landing.tsx
      Catalog.tsx
    hooks/
      usePreviewQueue.ts
    styles/
      globals.css
      theme.css
    main.tsx
    App.tsx
  vite.config.ts
  package.json
  tsconfig.json
  README.md
```

## State Flow
- `useSession` keeps `payhipCode`, `customerEmail`, `activeRentalId`, `signedUrl`.
- `useCatalog` fetches movies on load, caches results.
- Preview autoplay: `usePreviewQueue` attaches observers to cards, waits 4s before dispatching `setPreviewMovieId` in store.

## API Interactions
- `POST /api/payhip/validate` -> confirm code, store metadata.
- `POST /api/rentals` -> create rental, returns signedUrl (if new).
- `GET /api/rentals/:id` -> refresh signedUrl when user re-enters.

## Visual Style
- Base colors: `#0f0f1a` background, `#e50914` accent.
- Use Tailwind config for fonts + spacing.
- Mobile-first: carousels scroll horizontally with momentum; layout uses CSS grid for >768px.

## Dependencies
- `react-router-dom`
- `zustand`
- `axios`
- `clsx`
- `lucide-react` (icons)
- `react-intersection-observer` for preview triggers
- `@radix-ui/react-dialog` for player modal
- `tailwindcss` + `postcss` + `autoprefixer`

## Build/Run
- `npm create vite@latest frontend -- --template react-ts` (handled manually)
- `npm install` dependencies
- Scripts: `dev`, `build`, `preview`, `lint (tsc --noEmit)`
