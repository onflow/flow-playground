import React, { useEffect } from 'react';
import { Global } from '@emotion/core';
import { ThemeProvider, Text } from 'theme-ui';
import { Router, Redirect, globalHistory } from '@reach/router';
import { ApolloProvider } from '@apollo/react-hooks';
import AppMobileWrapper from 'containers/AppMobileWrapper';
import BrowserDetector from 'components/BrowserDetector';
import * as GoogleAnalytics from './util/google-analytics';
import client from 'api/apollo/client';
import globalStyles from './globalStyles';
import theme from './theme';
import 'reset-css';

import Playground from 'containers/Editor';
import FourOhFour from './pages/404';

GoogleAnalytics.initialize(process.env.GA_TRACKING_CODE);

const Base = (props: any) => {
  return <div>{props.children}</div>;
};

const version = (
  <Text
    sx={{
      color: 'lightgrey',
      position: 'absolute',
      bottom: '1rem',
      right: '1rem',
    }}
  >
    v0.3.5
  </Text>
);

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
                <Playground path=":projectId" />
                <Redirect noThrow={true} from="*" to="local" />
              </Base>
            </Router>
            {version}
          </AppMobileWrapper>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
