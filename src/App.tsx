import React, { useEffect } from "react";
import {Helmet} from "react-helmet";
import { Global } from "@emotion/core";
import { ThemeProvider, Text } from "theme-ui"
import { Router, Redirect, globalHistory } from "@reach/router";
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

const seoImage = process.env.DEFAULT_SEO_IMAGE;

const headers = <Helmet>
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
  <meta property="twitter:image" content={seoImage}/>
</Helmet>

const version = <Text
  sx={{
    color: "lightgrey",
    position: "absolute",
    bottom: "1rem",
    right: "1rem"
  }}
>
  v0.3.5
</Text>

const App: React.FC = () => {

  useEffect(() => {
    // record initial pageview
    GoogleAnalytics.pageview(globalHistory.location);

    return globalHistory.listen(window => {
      // capture navigation to other pages
      GoogleAnalytics.pageview(window.location);
    });
  }, []);

  return (
    <>
      {headers}
      <BrowserDetector />
      <Global styles={globalStyles} />
        <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
           <AppMobileWrapper>
             <Router>
               <FourOhFour path="/404" />
               <Playground path="/:projectId"/>
               <Redirect noThrow={true} from="/*" to="/local"/>
             </Router>
             {version}
           </AppMobileWrapper>
         </ThemeProvider>
       </ApolloProvider>
    </>
  );
};

export default App;
