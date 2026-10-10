package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// Notifier delivers a contact message somewhere a person will see it.
type Notifier interface {
	Notify(ctx context.Context, msg ContactMessage) error
}

// ResendNotifier emails each message through the Resend API (https://resend.com).
type ResendNotifier struct {
	APIKey   string
	From     string
	To       string
	Endpoint string // defaults to Resend's API; overridden in tests
	Client   *http.Client
}

func (n *ResendNotifier) Notify(ctx context.Context, msg ContactMessage) error {
	endpoint := n.Endpoint
	if endpoint == "" {
		endpoint = "https://api.resend.com/emails"
	}
	client := n.Client
	if client == nil {
		client = &http.Client{Timeout: 10 * time.Second}
	}

	payload, err := json.Marshal(map[string]any{
		"from":     n.From,
		"to":       []string{n.To},
		"reply_to": msg.Email,
		"subject":  "Website message from " + msg.Name,
		"text": fmt.Sprintf("%s\n\n--\nFrom: %s <%s>\nSent via the contact form at %s UTC. Reply to this email to answer them.\n",
			msg.Message, msg.Name, msg.Email, msg.Received.Format("Jan 2, 2006 15:04")),
	})
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+n.APIKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(res.Body, 1<<10))
		return fmt.Errorf("resend: %s: %s", res.Status, strings.TrimSpace(string(body)))
	}
	return nil
}
