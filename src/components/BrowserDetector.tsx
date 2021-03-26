import React from 'react';
import styled from '@emotion/styled';
import theme from '../theme';

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

const CookieWarning = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const CookieWarningModal = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1), 0 0 3px 1px rgba(0, 0, 0, 0.05);
  max-width: 420px;
  line-height: 1.2rem;
  h2 {
    font-size: 1.5rem;
    padding-bottom: 1rem;
  }
  p {
    color: #222;
  }
`;

const BrowserDetector: React.FC = () => {
  switch (true) {
    case browser && browser.name === 'safari':
      return (
        <UnsupportedMessage>
          You're currently using an unsupported browser to access the Flow
          Playground. We hope to support your browser in the future, but for now
          some features may not function as intended. In order to have the best
          experience, we recommend you use either Chrome or Firefox to access
          the Flow Playground.
        </UnsupportedMessage>
      );
    case navigator && !navigator.cookieEnabled:
      return (
        <CookieWarning>
          <CookieWarningModal>
            <h2>🍪 Please enable cookies</h2>
            <p>
              The Playground uses cookies to manage projects. You'll need to
              enable cookies in your browser to use the Playground. We don't use
              cookies to track you, or collect your personal information.
            </p>
          </CookieWarningModal>
        </CookieWarning>
      );
    default:
      return null;
  }
};

export default BrowserDetector;
