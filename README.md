# personal-site

Portfolio and blog. A React frontend on GitHub Pages, backed by a small Go API on Fly.io.

```
web/   Vite + React + TypeScript (React Router). Static, deployed to GitHub Pages.
api/   Go (net/http). Serves Markdown blog posts as JSON and accepts contact-form messages.
```

## Develop

```sh
# terminal 1: API on :8080
cd api && go run .

# terminal 2: site on :5173
cd web && npm install && npm run dev
```

Open http://localhost:5173.

## Editing content

- **Name, bio, links, projects:** `web/src/site.ts`
- **Blog posts:** add `api/content/posts/<slug>.md`:

  ```markdown
  ---
  title: My post
  date: 2026-10-02
  summary: One line shown in the post list.
  tags: go, react
  draft: false
  ---

  Markdown body (GitHub-flavored)...
  ```

  Posts are loaded when the API starts, so restart `go run .` (or redeploy) to pick up changes.
- **Contact messages** are appended to `$DATA_DIR/messages.jsonl` (`api/data/` locally,
  a Fly volume in production). Read them with `fly ssh console -C "cat /data/messages.jsonl"`.

## Test

```sh
cd api && go test ./...
cd web && npm run lint && npm run build
```

## API

| Method | Path                 | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/api/posts`         | Post summaries, newest first         |
| GET    | `/api/posts/{slug}`  | One post with rendered HTML          |
| POST   | `/api/contact`       | `{name, email, message}`, 5/hour/IP  |
| GET    | `/healthz`           | Health check                         |

Config (env): `PORT`, `CONTENT_DIR`, `DATA_DIR`, `ALLOWED_ORIGINS` (comma-separated).

## Deploy

### API → Fly.io (once)

```sh
cd api
# edit fly.toml: set `app` to a unique name and ALLOWED_ORIGINS to your Pages URL
fly launch --no-deploy --copy-config
fly volumes create contact_data --size 1
fly deploy
```

For deploys on push, add a `FLY_API_TOKEN` repo secret (`fly tokens create deploy`).

### Site → GitHub Pages

1. Push to GitHub. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions → **Variables**:
   - `API_URL` = `https://<your-app>.fly.dev`
   - `BASE_PATH` = `/` if the repo is `<user>.github.io`; otherwise it defaults to `/<repo>/`.

Pushes to `main` that touch `web/` redeploy the site; pushes touching `api/` test and redeploy the API.
