import { ApolloProvider } from '@apollo/react-hooks';
import { Global } from '@emotion/react';
import { globalHistory, Router } from '@reach/router';
import React, { useEffect } from 'react';
import 'reset-css';
import { ThemeProvider } from 'theme-ui';
import client from 'api/apollo/client';
import * as GoogleAnalytics from 'util/google-analytics';
import BrowserDetector from 'components/BrowserDetector';
import AppMobileWrapper from 'containers/AppMobileWrapper';
<<<<<<< HEAD
import Playground from 'containers/Playground';

=======
import Playground from 'containers/Editor';
>>>>>>> eb2105e (v2 editor file explorer)
import globalStyles from './globalStyles';
import FourOhFour from './pages/404';
import theme from './theme';
import tooltipStyles from './tooltipStyles';

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
      <Global styles={[globalStyles, tooltipStyles]} />
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
