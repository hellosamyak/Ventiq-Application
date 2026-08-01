# Ventiq | Create. Publish. Connect.

> Your videos. Your voice. One stage.

Ventiq is a creator-first social video workspace — a blend of video publishing and short-form updates. Channels, videos, tweets, comments, likes, subscriptions, playlists, and account controls live in a single flow.

This repository contains the **frontend application** (a Vite + React SPA). It talks to a separate REST API backend over the endpoints defined in [`src/api/client.js`](src/api/client.js).

## Features

- **Authentication** — Register with avatar/cover upload, sign in with email or username, JWT access/refresh tokens, and protected routes with a loading gate.
- **Video feed** — Browse, search, and watch videos; like videos and toggle comments from a dedicated watch view.
- **Tweets** — Post, edit, like, and delete short updates from the same creator identity.
- **Creator Studio** — Manage uploads: edit title/description/thumbnail, publish or unpublish, and delete videos.
- **Library** — Create playlists, add/remove videos from the watch page, view liked videos, and track your network (subscriptions and subscribers).
- **Channels** — Public channel pages with videos, tweets, subscriber counts, and subscribe/unsubscribe.
- **Watch history & subscriptions** — Revisit watched videos and browse followed channels.
- **Account center** — Update profile details, change password, and replace avatar/cover image.
- **Theming** — Dark/light mode with `prefers-color-scheme` detection, a persisted choice, and a flash-free bootstrap script.
- **Responsive shell** — Collapsible sidebar navigation with a mobile drawer and per-route page headers.
- **UI kit** — Reusable `Button`, `EmptyState`, `FileDrop`, `Notice`, `Skeleton`, `SkeletonCard`, and `LoadingScreen` components.

## Tech Stack

- **React 19** with hooks and context (`AuthContext`, `ThemeContext`)
- **Vite 8** as the build tool and dev server
- **Tailwind CSS v4** via `@tailwindcss/vite`, with a custom design-token theme in `src/index.css`
- **React Router 7** (`BrowserRouter`) for client-side routing
- **lucide-react** for icons
- **ESLint 10** (flat config) with `react-hooks` and `react-refresh` plugins

## Getting Started

### Prerequisites

- Node.js (version compatible with Vite 8)
- npm

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env   # then edit .env
```

Start the dev server:

```bash
npm run dev
```

The app runs at the URL printed by Vite. In development, `/api` requests are proxied to `http://localhost:8000` (see `vite.config.js`), so a local backend should be running there.

## Environment Variables

| Variable            | Description                                                       | Default   |
| ------------------- | ----------------------------------------------------------------- | --------- |
| `VITE_API_BASE_URL` | Base URL of the Ventiq backend API. Leave unset to use `/api/v1`. | `/api/v1` |

Example:

```
VITE_API_BASE_URL=https://your-backend.example.com/api/v1
```

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite development server  |
| `npm run build`   | Build production assets to `dist/` |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Lint the codebase with ESLint      |

## Project Structure

```
├── public/                 # Static assets (favicon)
├── src/
│   ├── api/
│   │   └── client.js        # API client: auth, videos, tweets, comments, likes, playlists, subscriptions, users
│   ├── components/
│   │   ├── ui/              # Button, EmptyState, FileDrop, Notice, Skeleton, SkeletonCard, LoadingScreen
│   │   ├── Header/          # Top bar with page meta, actions, and account menu
│   │   ├── Footer/          # App footer
│   │   ├── Shell.jsx        # Authenticated layout: sidebar + main panel
│   │   ├── AuthForms.jsx    # Login / signup forms
│   │   ├── TweetComposer.jsx
│   │   ├── UploadVideo.jsx  # Video upload form
│   │   ├── VideoCard.jsx
│   │   └── ...              # Brand, Logo, ThemeToggle, etc.
│   ├── context/             # AuthContext, ThemeContext (+ core stubs)
│   ├── hooks/               # useAuth, useTheme
│   ├── pages/               # Landing, Dashboard (feed/watch/tweets/library), Studio,
│   │                        # AccountCenter, Channel, History, Subscriptions, Subscribers, PlaylistDetail
│   ├── App.jsx              # Route definitions + auth guards
│   ├── main.jsx             # App entry point
│   └── index.css            # Tailwind theme tokens, base styles, and component styles
├── index.html              # HTML shell with theme bootstrap and font loading
├── vite.config.js          # Vite config + dev proxy
└── package.json
```

## Routes

| Path                      | Description                                |
| ------------------------- | ------------------------------------------ |
| `/`                       | Landing page                               |
| `/login` · `/signup`      | Authentication                             |
| `/feed`                   | Video feed with search                     |
| `/watch/:videoId`         | Watch view with comments, likes, playlists |
| `/tweets`                 | Tweet stream                               |
| `/library`                | Playlists, liked videos, network           |
| `/upload`                 | Publish a video                            |
| `/studio`                 | Creator studio                             |
| `/history`                | Watch history                              |
| `/subscriptions`          | Followed channels                          |
| `/subscribers/:channelId` | Channel subscribers                        |
| `/channel/:username`      | Public channel page                        |
| `/playlist/:playlistId`   | Playlist detail                            |
| `/account`                | Account center                             |

Authenticated routes redirect to `/login` when signed out; signed-in users are redirected away from `/login` and `/signup`.

## Deployment

The app is a standard Vite SPA. To deploy:

```bash
npm run build
```

Serve the generated `dist/` directory from any static host. Because routing uses `BrowserRouter`, configure the host to fall back to `index.html` for unknown paths (SPA rewrites). Point `VITE_API_BASE_URL` at a reachable backend during the build.

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes focused; follow the existing component and styling conventions.
3. Run `npm run lint` and verify the app builds with `npm run build`.
4. Open a pull request describing the change.

## License

This project does not currently include a license file. All rights reserved by default; reach out to the maintainers if you intend to reuse the code.
