package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"net/mail"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// ContactMessage is one contact-form submission.
type ContactMessage struct {
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Message  string    `json:"message"`
	Website  string    `json:"website,omitempty"` // honeypot: real users leave it empty
	Received time.Time `json:"received"`
}

// Inbox appends messages to a JSON Lines file and, when a notifier is set,
// forwards each one (e.g. by email). The file is kept as a backup either way.
type Inbox struct {
	mu       sync.Mutex
	path     string
	notifier Notifier
}

func NewInbox(dir string, notifier Notifier) (*Inbox, error) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return nil, err
	}
	return &Inbox{path: filepath.Join(dir, "messages.jsonl"), notifier: notifier}, nil
}

func (in *Inbox) save(msg ContactMessage) error {
	in.mu.Lock()
	defer in.mu.Unlock()
	f, err := os.OpenFile(in.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return err
	}
	defer f.Close()
	return json.NewEncoder(f).Encode(msg)
}

func (in *Inbox) handleSubmit(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	var msg ContactMessage
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	// Bots fill in every field; pretend success so they don't retry.
	if msg.Website != "" {
		writeJSON(w, http.StatusAccepted, map[string]string{"status": "received"})
		return
	}

	msg.Name = strings.TrimSpace(msg.Name)
	msg.Email = strings.TrimSpace(msg.Email)
	msg.Message = strings.TrimSpace(msg.Message)
	if problem := validateContact(msg); problem != "" {
		writeJSON(w, http.StatusUnprocessableEntity, map[string]string{"error": problem})
		return
	}

	if addr, err := mail.ParseAddress(msg.Email); err == nil {
		msg.Email = addr.Address // drop any display name, e.g. "Ada <ada@x.com>"
	}
	msg.Received = time.Now().UTC()

	// Either saving or emailing is enough for the message to reach Chris.
	saveErr := in.save(msg)
	if saveErr != nil {
		slog.Error("saving contact message", "err", saveErr)
	}
	delivered := saveErr == nil
	if in.notifier != nil {
		if err := in.notifier.Notify(r.Context(), msg); err != nil {
			slog.Error("emailing contact message", "err", err)
		} else {
			delivered = true
		}
	}
	if !delivered {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not send message"})
		return
	}
	slog.Info("contact message received", "from", msg.Email)
	writeJSON(w, http.StatusAccepted, map[string]string{"status": "received"})
}

func validateContact(msg ContactMessage) string {
	switch {
	case msg.Name == "" || len(msg.Name) > 100:
		return "name is required (max 100 characters)"
	case strings.ContainsAny(msg.Name, "\r\n"):
		return "name must be a single line"
	case len(msg.Email) > 254:
		return "email is too long"
	case msg.Message == "" || len(msg.Message) > 5000:
		return "message is required (max 5000 characters)"
	}
	if _, err := mail.ParseAddress(msg.Email); err != nil {
		return "a valid email is required"
	}
	return ""
}
