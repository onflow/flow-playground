import * as React from "react"
import * as ReactDOM from "react-dom"

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import App from "./App"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const root = document.getElementById("root")
ReactDOM.render(<App />, root)
