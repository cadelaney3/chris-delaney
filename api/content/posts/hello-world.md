---
title: Hello, world
date: 2026-10-02
summary: Why I built this site, and how it's put together.
tags: meta, go, react
---

Welcome to my corner of the internet. This site is a small React frontend talking to a Go API,
and this post is served from a Markdown file the API renders on startup.

## How it works

- The **frontend** is a Vite + React app hosted on GitHub Pages.
- The **API** is a small Go service on Fly.io. It reads Markdown from `content/posts/`
  and serves it as JSON.
- The **contact form** posts to the same API.

```go
mux.HandleFunc("GET /api/posts/{slug}", store.handleGet)
```

More soon.
