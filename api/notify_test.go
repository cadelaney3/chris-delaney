package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestResendNotifier(t *testing.T) {
	var got map[string]any
	var auth string
	resend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth = r.Header.Get("Authorization")
		json.NewDecoder(r.Body).Decode(&got)
		w.Write([]byte(`{"id":"123"}`))
	}))
	defer resend.Close()

	n := &ResendNotifier{APIKey: "re_test", From: "Site <onboarding@resend.dev>", To: "me@example.com", Endpoint: resend.URL}
	err := n.Notify(context.Background(), ContactMessage{
		Name: "Ada", Email: "ada@example.com", Message: "Hi there", Received: time.Now(),
	})
	if err != nil {
		t.Fatal(err)
	}
	if auth != "Bearer re_test" {
		t.Errorf("auth header = %q", auth)
	}
	if got["reply_to"] != "ada@example.com" || got["subject"] != "Website message from Ada" {
		t.Errorf("unexpected payload: %v", got)
	}
	if to, _ := got["to"].([]any); len(to) != 1 || to[0] != "me@example.com" {
		t.Errorf("to = %v", got["to"])
	}
	if text, _ := got["text"].(string); !strings.HasPrefix(text, "Hi there") {
		t.Errorf("text = %q", text)
	}
}

func TestResendNotifierError(t *testing.T) {
	resend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, `{"message":"invalid api key"}`, http.StatusUnauthorized)
	}))
	defer resend.Close()

	n := &ResendNotifier{APIKey: "bad", To: "me@example.com", Endpoint: resend.URL}
	if err := n.Notify(context.Background(), ContactMessage{Name: "Ada", Email: "a@example.com"}); err == nil || !strings.Contains(err.Error(), "invalid api key") {
		t.Errorf("err = %v, want it to include Resend's message", err)
	}
}

type fakeNotifier struct {
	sent []ContactMessage
	err  error
}

func (f *fakeNotifier) Notify(_ context.Context, msg ContactMessage) error {
	f.sent = append(f.sent, msg)
	return f.err
}

func TestContactEmailsMessage(t *testing.T) {
	for _, tc := range []struct {
		name      string
		notifyErr error
	}{
		{"email sent", nil},
		{"email fails but message is still saved", errors.New("resend down")},
	} {
		t.Run(tc.name, func(t *testing.T) {
			dataDir := t.TempDir()
			notifier := &fakeNotifier{err: tc.notifyErr}
			inbox, err := NewInbox(dataDir, notifier)
			if err != nil {
				t.Fatal(err)
			}
			srv := newServer(&PostStore{bySlug: map[string]Post{}}, inbox, nil)

			rec := httptest.NewRecorder()
			body := `{"name":"Ada","email":"Ada Lovelace <ada@example.com>","message":"Hello!"}`
			srv.ServeHTTP(rec, httptest.NewRequest("POST", "/api/contact", strings.NewReader(body)))

			if rec.Code != http.StatusAccepted {
				t.Fatalf("status = %d", rec.Code)
			}
			if len(notifier.sent) != 1 || notifier.sent[0].Email != "ada@example.com" {
				t.Errorf("notified %+v, want one message with the bare address", notifier.sent)
			}
			if _, err := os.Stat(filepath.Join(dataDir, "messages.jsonl")); err != nil {
				t.Errorf("message not saved: %v", err)
			}
		})
	}
}

func TestContactRejectsMultilineName(t *testing.T) {
	srv, _ := testServer(t)
	rec := httptest.NewRecorder()
	body := `{"name":"Ada\nBcc: x@evil.com","email":"ada@example.com","message":"Hello"}`
	srv.ServeHTTP(rec, httptest.NewRequest("POST", "/api/contact", strings.NewReader(body)))
	if rec.Code != http.StatusUnprocessableEntity {
		t.Errorf("status = %d, want 422", rec.Code)
	}
}
