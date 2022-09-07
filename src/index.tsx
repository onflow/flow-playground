import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import App from './App';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new BrowserTracing()
  ],
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    const error = hint.originalException;

    const ignoreErrors = [
      /GraphQL/i, // filter out graphql errors
      /Failed to fetch/i // filter out failed to fetch network errors
    ]

    // filter out blacklisted errors
    if (error && error.message) {
      for (const filter of ignoreErrors) {
        if (error.message.match(filter)) {
          return null
        }
      }
    }

    return event;
  },
});

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
