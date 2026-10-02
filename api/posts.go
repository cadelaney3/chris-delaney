package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
)

// PostMeta is the summary returned by the list endpoint.
type PostMeta struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Date        time.Time `json:"date"`
	Summary     string    `json:"summary"`
	Tags        []string  `json:"tags"`
	ReadingMins int       `json:"readingMinutes"`
}

// Post is a full post including rendered HTML.
type Post struct {
	PostMeta
	HTML string `json:"html"`
}

// PostStore holds all published posts in memory, newest first.
type PostStore struct {
	list   []PostMeta
	bySlug map[string]Post
}

var md = goldmark.New(
	goldmark.WithExtensions(extension.GFM, extension.Typographer),
	goldmark.WithParserOptions(parser.WithAutoHeadingID()),
)

// LoadPosts reads every *.md file in dir. The file name (minus extension) is
// the slug. Posts with `draft: true` in their frontmatter are skipped.
func LoadPosts(dir string) (*PostStore, error) {
	files, err := filepath.Glob(filepath.Join(dir, "*.md"))
	if err != nil {
		return nil, err
	}
	store := &PostStore{bySlug: make(map[string]Post)}
	for _, f := range files {
		post, draft, err := loadPost(f)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", f, err)
		}
		if draft {
			continue
		}
		store.bySlug[post.Slug] = post
		store.list = append(store.list, post.PostMeta)
	}
	sort.Slice(store.list, func(i, j int) bool {
		return store.list[i].Date.After(store.list[j].Date)
	})
	return store, nil
}

func loadPost(path string) (post Post, draft bool, err error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return post, false, err
	}
	meta, body, err := splitFrontmatter(raw)
	if err != nil {
		return post, false, err
	}

	post.Slug = strings.TrimSuffix(filepath.Base(path), ".md")
	post.Title = meta["title"]
	post.Summary = meta["summary"]
	if post.Title == "" {
		return post, false, fmt.Errorf("missing title")
	}
	if post.Date, err = time.Parse("2006-01-02", meta["date"]); err != nil {
		return post, false, fmt.Errorf("date must be YYYY-MM-DD: %w", err)
	}
	post.Tags = []string{}
	for _, t := range strings.Split(meta["tags"], ",") {
		if t = strings.TrimSpace(t); t != "" {
			post.Tags = append(post.Tags, t)
		}
	}
	draft, _ = strconv.ParseBool(meta["draft"])

	words := len(bytes.Fields(body))
	post.ReadingMins = max(1, (words+199)/200)

	var html bytes.Buffer
	if err := md.Convert(body, &html); err != nil {
		return post, false, err
	}
	post.HTML = html.String()
	return post, draft, nil
}

// splitFrontmatter parses a simple `key: value` block delimited by `---` lines.
func splitFrontmatter(raw []byte) (map[string]string, []byte, error) {
	meta := make(map[string]string)
	sc := bufio.NewScanner(bytes.NewReader(raw))
	if !sc.Scan() || strings.TrimSpace(sc.Text()) != "---" {
		return nil, nil, fmt.Errorf("file must start with a --- frontmatter block")
	}
	offset := len(sc.Bytes()) + 1
	for sc.Scan() {
		line := sc.Text()
		offset += len(sc.Bytes()) + 1
		if strings.TrimSpace(line) == "---" {
			return meta, raw[min(offset, len(raw)):], nil
		}
		key, val, ok := strings.Cut(line, ":")
		if !ok {
			continue
		}
		meta[strings.TrimSpace(key)] = strings.Trim(strings.TrimSpace(val), `"'`)
	}
	return nil, nil, fmt.Errorf("unterminated frontmatter block")
}

func (s *PostStore) handleList(w http.ResponseWriter, r *http.Request) {
	list := s.list
	if list == nil {
		list = []PostMeta{}
	}
	writeJSON(w, http.StatusOK, list)
}

func (s *PostStore) handleGet(w http.ResponseWriter, r *http.Request) {
	post, ok := s.bySlug[r.PathValue("slug")]
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "post not found"})
		return
	}
	writeJSON(w, http.StatusOK, post)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
