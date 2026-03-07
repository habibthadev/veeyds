# Veeyds

A media downloader web app that lets users download videos and audio from popular social platforms by pasting a URL. No login. No accounts. No ads.

Built with a **React frontend** (Vite, TypeScript, Tailwind CSS v4) and a **Hono backend** (Node.js), deployable independently — frontend on Vercel, backend on Render.

---

## Features

- Paste a URL from any supported platform and extract available formats instantly
- Choose from all available formats: combined video+audio, video-only, audio-only, by quality tier
- Multi-URL queue — add multiple links and resolve them independently
- Dark mode and light mode with persistent preference
- No login, no tracking, no ads
- Streaming downloads — files never touch our storage
- Built-in rate limiting to protect the backend from abuse
- Fully typed, tested, and production-ready

---

## Supported Platforms

YouTube, Instagram, Facebook, TikTok, X (Twitter), Snapchat, Reddit, Vimeo, Twitch (clips), Pinterest, Dailymotion, SoundCloud, LinkedIn, Tumblr, and any other platform supported by [yt-dlp](https://github.com/yt-dlp/yt-dlp).

---

## Stack

| Layer     | Technology                                                      |
|-----------|-----------------------------------------------------------------|
| Frontend  | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion      |
| UI Primitives | Radix UI (Select, Dialog, Toast, AlertDialog), custom-styled |
| State     | TanStack Query v5, React Router v7                              |
| Backend   | Hono v4, Node.js adapter, TypeScript                            |
| Media     | yt-dlp, ffmpeg (static binaries, resolved at startup)           |
| Logging   | Pino (JSON in production, pretty in development)                |
| Validation| Zod v4 (shared schemas between request/response)                |
| Testing   | Vitest (frontend: 22 tests, backend: 34 tests)                  |
| Deploy    | Vercel (frontend), Render (backend)                             |

---

## Repository Structure

```
veeyds/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── app.css           # Tailwind v4 + design tokens + base styles
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── ui/           # Button, Input, Badge, Skeleton, Dialog, Dropdown, Toast
│   │   │   ├── layout/       # Header, Footer, ThemeToggle
│   │   │   ├── home/         # HeroSection, PlatformGrid, HowItWorks, FeatureStrip
│   │   │   └── download/     # UrlInput, FormatSelector, MediaPreview, QueueItem, DownloadQueue
│   │   ├── hooks/            # useDownload, useTheme, useMediaQuery, useToast
│   │   ├── pages/            # HomePage, DownloadPage
│   │   ├── services/         # api.ts — typed fetch wrappers
│   │   ├── types/            # media.ts, api.ts
│   │   └── utils/            # cn.ts, format.ts, validators.ts
│   ├── vercel.json           # SPA rewrites, asset caching, security headers
│   └── .env.example
│
├── server/                   # Hono backend (Node.js)
│   ├── src/
│   │   ├── index.ts          # App entry, middleware, Swagger UI, error handling
│   │   ├── routes/           # media.ts
│   │   ├── controllers/      # media.controller.ts
│   │   ├── services/         # extractor.service.ts, stream.service.ts
│   │   ├── middleware/       # cors.ts, rateLimit.ts, validate.ts
│   │   ├── utils/            # ytdlp.ts, sanitize.ts, process.ts, format.ts
│   │   └── types/            # media.ts — Zod schemas + inferred types
│   ├── tests/
│   │   ├── unit/             # sanitize, format, rateLimit, validate
│   │   └── integration/      # api.test.ts
│   ├── scripts/
│   │   └── install-bins.sh   # Downloads yt-dlp and ffmpeg static binaries
│   └── .env.example
│
├── render.yaml               # Render infrastructure-as-code (backend)
├── .gitignore
└── .node-version             # Pins Node 22
```

---

## Prerequisites

- Node.js 22+
- pnpm 10+
- `yt-dlp` and `ffmpeg` — installed automatically by the setup script on Linux, or via your system package manager on macOS

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/habibthadev/veeyds.git
cd veeyds
```

### 2. Start the backend

```bash
cd server
pnpm install

# Downloads yt-dlp and ffmpeg to server/bin/ (Linux only — use brew on macOS)
pnpm run setup

# Start with hot-reload
pnpm dev
```

The server starts at `http://localhost:3001`.

On macOS, install dependencies manually before `pnpm dev`:

```bash
brew install yt-dlp ffmpeg
```

### 3. Start the frontend

```bash
cd client
pnpm install
pnpm dev
```

The frontend starts at `http://localhost:5173`. It proxies all `/api` requests to `localhost:3001` automatically.

---

## Environment Variables

### Backend (`server/.env`)

| Variable           | Default                  | Description                                        |
|--------------------|---------------------------|----------------------------------------------------|
| `PORT`             | `3001`                    | Port the server listens on                         |
| `NODE_ENV`         | `development`             | Set to `production` for JSON logs, strict CORS     |
| `ALLOWED_ORIGINS`  | _(allow all)_             | Comma-separated allowed origins, e.g. `https://veeyds.vercel.app` |
| `API_BASE_URL`     | `http://localhost:3001`   | Used in the OpenAPI spec `servers` field           |

Copy the example and fill in values:

```bash
cp server/.env.example server/.env
```

### Frontend (`client/.env`)

| Variable        | Default | Description                                                          |
|-----------------|---------|----------------------------------------------------------------------|
| `VITE_API_URL`  | _(empty)_ | Backend base URL (no trailing slash, no `/api`). Leave empty in dev — Vite proxy handles it. Set to the Render URL in production. |

```bash
cp client/.env.example client/.env
```

---

## API Reference

Interactive docs are available at `http://localhost:3001/api/docs` (Swagger UI) when the server is running.

### `POST /api/media/info`

Extracts metadata and available formats for a given URL.

**Rate limit:** 30 requests per IP per 15 minutes.

**Request body:**
```json
{ "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
```

**Response:**
```json
{
  "title": "Rick Astley - Never Gonna Give You Up",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "duration": 213,
  "platform": "Youtube",
  "originalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "formats": [
    {
      "id": "137+140",
      "ext": "mp4",
      "resolution": "1920x1080",
      "filesize": 52428800,
      "hasAudio": true,
      "hasVideo": true,
      "label": "1920x1080 · mp4 · 50 MB"
    }
  ]
}
```

**Error responses:**

| HTTP | Code              | Cause                                    |
|------|-------------------|------------------------------------------|
| 400  | `INVALID_INPUT`   | Missing or malformed URL                 |
| 422  | `UNSUPPORTED_URL` | Platform not supported by yt-dlp         |
| 422  | `EXTRACTION_FAILED` | yt-dlp failed to extract info          |
| 429  | `RATE_LIMITED`    | Too many requests — see `Retry-After` header |
| 500  | `INTERNAL`        | Unexpected server error                  |

---

### `GET /api/media/download`

Streams a media file directly to the client. The browser triggers a native file download.

**Rate limit:** 10 requests per IP per 15 minutes.

**Query parameters:**

| Parameter  | Required | Description                                    |
|------------|----------|------------------------------------------------|
| `url`      | Yes      | The original media URL                         |
| `formatId` | Yes      | Format ID from the `/info` response            |

**Download strategy:**
- Formats that are already muxed (audio+video in one stream): piped directly from yt-dlp stdout to the response — zero disk usage.
- Formats that require muxing (separate video + audio streams merged by ffmpeg): written to a unique temp file, streamed to client, then deleted.

**Response headers:**
```
Content-Disposition: attachment; filename="Video_Title.mp4"
Content-Type: video/mp4
Content-Length: 52428800  (only for muxed downloads)
```

---

### `GET /health`

Returns server health status. Used by Render for health checks.

```json
{ "status": "ok" }
```

---

## Error Format

All error responses use a consistent structure:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Running Tests

### Backend

```bash
cd server
pnpm test
```

34 tests: 4 unit test suites (sanitize, format, rateLimit, validate) and 1 integration suite.

### Frontend

```bash
cd client
pnpm test
```

22 tests: utility functions (cn, format), component rendering (Badge, Input), and hook behaviour (useDownload).

---

## Deployment

### Backend → Render

The `render.yaml` at the repo root defines the service. Connect the repository on Render and set the following environment variables in the Render dashboard:

| Variable          | Value                              |
|-------------------|------------------------------------|
| `NODE_ENV`        | `production`                       |
| `ALLOWED_ORIGINS` | `https://veeyds.vercel.app`        |
| `API_BASE_URL`    | `https://veeyds-api.onrender.com`  |

The build command (`pnpm install && bash scripts/install-bins.sh && pnpm run build`) downloads yt-dlp and ffmpeg static binaries into `server/bin/` automatically during every deploy.

### Frontend → Vercel

Connect the repository on Vercel and configure:

| Setting               | Value                                      |
|-----------------------|--------------------------------------------|
| Root Directory        | `client`                                   |
| Build Command         | `pnpm run build`                           |
| Output Directory      | `dist`                                     |
| `VITE_API_URL` (env)  | `https://veeyds-api.onrender.com`          |

The `client/vercel.json` handles SPA routing rewrites and sets security headers automatically.

---

## Design System

The UI is built around a custom design system defined entirely in `client/src/app.css`:

- **Palette:** Grayscale base (`#0A0A0A` / `#F5F5F0`) with peach accent (`#E8724A` light, `#FFAB91` dark)
- **Typography:** [Syne](https://fonts.google.com/specimen/Syne) for headings, [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for body, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for metadata
- **Motion:** Framer Motion throughout, `cubic-bezier(0.16, 1, 0.3, 1)` as the standard easing
- **Primitives:** All interactive elements (select, dialog, toast) are custom-built on Radix UI — no raw browser defaults

---

## Security

- All user-supplied URLs are sanitized before being passed to yt-dlp as arguments (no shell interpolation)
- yt-dlp is spawned with `shell: false` — no shell injection surface
- Per-route in-memory rate limiting with `Retry-After` headers
- CORS restricted to `ALLOWED_ORIGINS` in production
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) set on all Vercel responses
- Temp files for muxed downloads are deleted immediately after the response stream closes

---

## Author

Built by [Habib Adebayo](https://habibthadev.tech).
