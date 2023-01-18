import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  HOTJAR_VERSION,
} from 'util/globalConstants';
import App from './App';
import Hotjar from '@hotjar/browser';

Hotjar.init(parseInt(process.env.HOTJAR_SITE_ID), HOTJAR_VERSION);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
