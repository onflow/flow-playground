import React, { useEffect } from 'react';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'theme-ui';
import { Router, globalHistory } from '@reach/router';
import { ApolloProvider } from '@apollo/react-hooks';
import 'reset-css';

import * as GoogleAnalytics from 'util/google-analytics';
import client from 'api/apollo/client';

import Playground from 'containers/Editor';
import AppMobileWrapper from 'containers/AppMobileWrapper';
import BrowserDetector from 'components/BrowserDetector';

import FourOhFour from './pages/404';
import globalStyles from './globalStyles';
import theme from './theme';

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

  return (
    <>
      <BrowserDetector />
      <Global styles={globalStyles} />
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
