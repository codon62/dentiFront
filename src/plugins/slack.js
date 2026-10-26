// Frontend-side Slack reporting has been disabled intentionally.
// The original archive contained embedded webhook credentials. A browser
// application cannot keep these secrets private, even via environment vars.
// Implement error reporting behind an authenticated backend endpoint instead.
export default {
  send() {
    // No-op for compatibility with legacy callers.
  },
};
