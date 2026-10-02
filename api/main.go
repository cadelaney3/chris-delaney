// Command api serves blog posts and accepts contact-form submissions for the
// personal site frontend.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

type config struct {
	port           string
	contentDir     string
	dataDir        string
	allowedOrigins []string
}

func loadConfig() config {
	return config{
		port:           getenv("PORT", "8080"),
		contentDir:     getenv("CONTENT_DIR", "content/posts"),
		dataDir:        getenv("DATA_DIR", "data"),
		allowedOrigins: strings.Split(getenv("ALLOWED_ORIGINS", "http://localhost:5173"), ","),
	}
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func newServer(store *PostStore, inbox *Inbox, allowedOrigins []string) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	mux.HandleFunc("GET /api/posts", store.handleList)
	mux.HandleFunc("GET /api/posts/{slug}", store.handleGet)

	limiter := newRateLimiter(5, time.Hour)
	mux.Handle("POST /api/contact", limiter.wrap(http.HandlerFunc(inbox.handleSubmit)))

	return logRequests(cors(allowedOrigins, mux))
}

func main() {
	cfg := loadConfig()

	store, err := LoadPosts(cfg.contentDir)
	if err != nil {
		slog.Error("loading posts", "dir", cfg.contentDir, "err", err)
		os.Exit(1)
	}
	slog.Info("loaded posts", "count", len(store.list))

	inbox, err := NewInbox(cfg.dataDir)
	if err != nil {
		slog.Error("opening inbox", "dir", cfg.dataDir, "err", err)
		os.Exit(1)
	}

	srv := &http.Server{
		Addr:              ":" + cfg.port,
		Handler:           newServer(store, inbox, cfg.allowedOrigins),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		slog.Info("listening", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server failed", "err", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("shutdown", "err", err)
	}
}
