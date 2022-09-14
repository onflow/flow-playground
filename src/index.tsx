import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  ignoreErrors: [/GraphQL/i, /Failed to fetch/i],
  tracesSampleRate: 1.0,
});

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
