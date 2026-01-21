import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance Monitoring
  tracesSampleRate: 0.1, // Capture 10% of transactions

  // Session Replay
  replaysSessionSampleRate: 0.1, // Capture 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV,

  // Ignore certain errors
  ignoreErrors: [
    // Network errors
    'Network Error',
    'Failed to fetch',
    'NetworkError',
    'ChunkLoadError',
    // User cancellation
    'AbortError',
    // Browser extensions
    /Extension context invalidated/,
    // Third-party scripts
    /Script error/,
  ],

  // Filter breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Don't log console breadcrumbs in development
    if (breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },
});
