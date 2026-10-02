package main

import (
	"bufio"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func writePost(t *testing.T, dir, name, content string) {
	t.Helper()
	if err := os.WriteFile(filepath.Join(dir, name), []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
}

func testServer(t *testing.T) (http.Handler, string) {
	t.Helper()
	postsDir, dataDir := t.TempDir(), t.TempDir()
	writePost(t, postsDir, "older.md", "---\ntitle: Older\ndate: 2026-01-01\ntags: a, b\n---\nOld body.\n")
	writePost(t, postsDir, "newer.md", "---\ntitle: \"Newer\"\ndate: 2026-06-01\nsummary: hi\n---\n# Heading\n\nNew **body**.\n")
	writePost(t, postsDir, "secret.md", "---\ntitle: Draft\ndate: 2026-07-01\ndraft: true\n---\nnope\n")

	store, err := LoadPosts(postsDir)
	if err != nil {
		t.Fatal(err)
	}
	inbox, err := NewInbox(dataDir)
	if err != nil {
		t.Fatal(err)
	}
	return newServer(store, inbox, []string{"https://example.com"}), dataDir
}

func TestListPostsSortedAndSkipsDrafts(t *testing.T) {
	srv, _ := testServer(t)
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, httptest.NewRequest("GET", "/api/posts", nil))

	var posts []PostMeta
	if err := json.NewDecoder(rec.Body).Decode(&posts); err != nil {
		t.Fatal(err)
	}
	if len(posts) != 2 {
		t.Fatalf("got %d posts, want 2 (draft excluded)", len(posts))
	}
	if posts[0].Slug != "newer" || posts[1].Slug != "older" {
		t.Errorf("wrong order: %s, %s", posts[0].Slug, posts[1].Slug)
	}
	if got := strings.Join(posts[1].Tags, ","); got != "a,b" {
		t.Errorf("tags = %q", got)
	}
}

func TestGetPost(t *testing.T) {
	srv, _ := testServer(t)
	rec := httptest.NewRecorder()
	srv.ServeHTTP(rec, httptest.NewRequest("GET", "/api/posts/newer", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	var post Post
	json.NewDecoder(rec.Body).Decode(&post)
	if post.Title != "Newer" || !strings.Contains(post.HTML, "<strong>body</strong>") {
		t.Errorf("unexpected post: %+v", post)
	}

	for _, slug := range []string{"missing", "secret"} {
		rec = httptest.NewRecorder()
		srv.ServeHTTP(rec, httptest.NewRequest("GET", "/api/posts/"+slug, nil))
		if rec.Code != http.StatusNotFound {
			t.Errorf("%s: status = %d, want 404", slug, rec.Code)
		}
	}
}

func TestContact(t *testing.T) {
	srv, dataDir := testServer(t)
	post := func(body string) int {
		rec := httptest.NewRecorder()
		srv.ServeHTTP(rec, httptest.NewRequest("POST", "/api/contact", strings.NewReader(body)))
		return rec.Code
	}

	if code := post(`{"name":"Ada","email":"ada@example.com","message":"Hello!"}`); code != http.StatusAccepted {
		t.Fatalf("valid message: status = %d", code)
	}
	if code := post(`{"name":"Ada","email":"not-an-email","message":"Hello"}`); code != http.StatusUnprocessableEntity {
		t.Errorf("bad email: status = %d", code)
	}
	if code := post(`{"name":"Bot","email":"b@example.com","message":"spam","website":"x"}`); code != http.StatusAccepted {
		t.Errorf("honeypot: status = %d", code)
	}

	f, err := os.Open(filepath.Join(dataDir, "messages.jsonl"))
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	lines := 0
	for sc := bufio.NewScanner(f); sc.Scan(); lines++ {
	}
	if lines != 1 {
		t.Errorf("stored %d messages, want 1 (invalid and honeypot dropped)", lines)
	}
}

func TestRateLimiter(t *testing.T) {
	rl := newRateLimiter(2, time.Minute)
	now := time.Now()
	if !rl.allow("1.1.1.1", now) || !rl.allow("1.1.1.1", now) {
		t.Fatal("first two requests should pass")
	}
	if rl.allow("1.1.1.1", now) {
		t.Error("third request should be limited")
	}
	if !rl.allow("2.2.2.2", now) {
		t.Error("other IPs are unaffected")
	}
	if !rl.allow("1.1.1.1", now.Add(2*time.Minute)) {
		t.Error("limit should reset after the window")
	}
}

func TestCORS(t *testing.T) {
	srv, _ := testServer(t)
	for origin, want := range map[string]string{"https://example.com": "https://example.com", "https://evil.com": ""} {
		req := httptest.NewRequest("OPTIONS", "/api/contact", nil)
		req.Header.Set("Origin", origin)
		rec := httptest.NewRecorder()
		srv.ServeHTTP(rec, req)
		if got := rec.Header().Get("Access-Control-Allow-Origin"); got != want {
			t.Errorf("origin %s: allow-origin = %q, want %q", origin, got, want)
		}
	}
}
