import { ApolloProvider } from '@apollo/react-hooks';
import { Global } from '@emotion/react';
import { globalHistory, Router } from '@reach/router';
import React, { useEffect } from 'react';
import 'reset-css';
import { ThemeProvider } from 'theme-ui';
import client from 'api/apollo/client';
import * as GoogleAnalytics from 'util/google-analytics';
import { onLCP, onFID, onCLS, CLSMetric } from 'web-vitals';
import BrowserDetector from 'components/BrowserDetector';
import AppMobileWrapper from 'containers/AppMobileWrapper';
import Playground from 'containers/Playground';
import globalStyles from './globalStyles';
import FourOhFour from './pages/404';
import theme from './theme';
import tooltipStyles from './tooltipStyles';
import { Helmet } from 'react-helmet';

GoogleAnalytics.initialize(process.env.GA_TRACKING_CODE);

const Base = (props: any) => {
  return <div>{props.children}</div>;
};

const App: React.FC = () => {
  useEffect(() => {
    // record initial pageview
    GoogleAnalytics.pageview(globalHistory.location);

    return globalHistory.listen((window) => {
      // capture navigation to other pages
      GoogleAnalytics.pageview(window.location);
    });
  }, []);

  function sendToGoogleAnalytics({ name, delta, value, id }: CLSMetric) {
    window?.gtag('event', name, {
      // Built-in params:
      value: delta, // Use `delta` so the value can be summed.
      // Custom params:
      metric_id: id, // Needed to aggregate events.
      metric_value: value, // Optional.
      metric_delta: delta, // Optional.

      // OPTIONAL: any additional params or debug info here.
      // See: https://web.dev/debug-performance-in-the-field/
      // metric_rating: 'good' | 'needs-improvement' | 'poor',
      // debug_info: '...',
      // ...
    });
  }

  if (process.env.GA_TRACKING_ID) {
    onCLS(sendToGoogleAnalytics);
    onFID(sendToGoogleAnalytics);
    onLCP(sendToGoogleAnalytics);
  }

  return (
    <>
      <BrowserDetector />
      <Global styles={[globalStyles, tooltipStyles]} />
      {process.env.GA_TRACKING_ID && (
        <Helmet>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script>
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.GA_TRACKING_ID}');
              `}
          </script>
        </Helmet>
      )}
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AppMobileWrapper>
            <Router>
              <Base path="/">
                <FourOhFour path="404" />
                <Playground path="/" />
                <Playground path="/:projectId" />
              </Base>
            </Router>
          </AppMobileWrapper>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
