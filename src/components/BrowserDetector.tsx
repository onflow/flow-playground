import React, { useMemo } from 'react';
import styled from '@emotion/styled';

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

const CookieDetector: React.FC = () => {
  if (!navigator || navigator.cookieEnabled) return null;
  return (
    <CookieWarning>
      <CookieWarningModal>
        <h2>🍪 Please enable cookies</h2>
        <p>
          The Playground uses cookies to manage projects. You&apos;ll need to
          enable cookies in your browser to use the Playground. We don&apos;t
          use cookies to track you, or collect your personal information.
        </p>
      </CookieWarningModal>
    </CookieWarning>
  );
};

export default CookieDetector;
