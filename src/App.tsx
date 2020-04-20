import React, { useEffect }from "react";
import { Global } from "@emotion/core";
import { ThemeProvider, Text } from "theme-ui";
import { Root, Head } from "react-static";
import { Router, globalHistory } from "@reach/router";
import { ApolloProvider } from "@apollo/react-hooks";
import AppMobileWrapper from "containers/AppMobileWrapper";
import BrowserDetector from "components/BrowserDetector";
import * as GoogleAnalytics from "./util/google-analytics";
import client from "api/apollo/client";
import globalStyles from "./globalStyles";
import theme from "./theme";
import "reset-css";

import Playground from "containers/Editor";
import FourOhFour from "./pages/404";

GoogleAnalytics.initialize(process.env.GA_TRACKING_CODE);

const App: React.FC = () => {
  const seoImage = process.env.DEFAULT_SEO_IMAGE;

  useEffect(() => {
    // record initial pageview
    GoogleAnalytics.pageview(globalHistory.location);

    return globalHistory.listen(window => {
      // capture navigation to other pages
      GoogleAnalytics.pageview(window.location);
    });
  }, []);

  return (
    <Root>
      <BrowserDetector />
      <Head>
        <title lang="en">Flow Playground</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="title" content="Flow Playground" />
        <meta
          name="description"
          content="Flow introduces resource-oriented programming, a new paradigm that pairs linear types with object capabilities to create a secure and declarative model for digital ownership."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://play.onflow.org/" />
        <meta property="og:title" content="Flow Playground" />
        <meta
          property="og:description"
          content="Flow introduces resource-oriented programming, a new paradigm that pairs linear types with object capabilities to create a secure and declarative model for digital ownership."
        />
        <meta property="og:image" content={seoImage} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://play.onflow.org/" />
        <meta property="twitter:title" content="Flow Playground" />
        <meta
          property="twitter:description"
          content="Flow introduces resource-oriented programming, a new paradigm that pairs linear types with object capabilities to create a secure and declarative model for digital ownership."
        />
        <meta property="twitter:image" content={seoImage}></meta>
      </Head>
      <Global styles={globalStyles} />
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AppMobileWrapper>
            <Router>
              <FourOhFour path="/404" />
              <Playground path="/*" />
            </Router>
            <Text
              sx={{
                color: "lightgrey",
                position: "absolute",
                bottom: "1rem",
                right: "1rem"
              }}
            >
              v0.10-alpha
            </Text>
          </AppMobileWrapper>
        </ThemeProvider>
      </ApolloProvider>
    </Root>
  );
};

export default App;
