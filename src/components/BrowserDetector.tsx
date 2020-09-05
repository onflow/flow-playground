import React from "react";
import styled from "@emotion/styled";
import theme from "../theme";

const { detect } = require('detect-browser');
const browser = detect();

const UnsupportedMessage = styled.div`
    top: 0;
    left: 0;
    width: 100vw;
    height: 100px;
    display: fled;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 1rem 2rem 1rem;
    color: ${theme.colors.error};
    font-size: ${theme.fontSizes[5]};
    font-weight: 700;
`;

const BrowserDetector: React.FC = () => {
    switch (browser && browser.name) {
      case 'safari':
        return (
          <UnsupportedMessage>
              You're currently using an unsupported browser to access the Flow Playground.

              We hope to support your browser in the future, but for now some features may not function as intended.

              In order to have the best experience, we recommend you use either Chrome or Firefox to access the Flow Playground.
          </UnsupportedMessage>
        )

      default:
        return null
    }
}

export default BrowserDetector;
