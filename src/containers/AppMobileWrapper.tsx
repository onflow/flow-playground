import styled from '@emotion/styled';
import React from 'react';
import { ChildProps } from 'src/types';
import { Box, Button, Text } from 'theme-ui';

const AppMobileWrapperDiv = styled.div`
  display: block;
  position: relative;
  @media only screen and (max-width: 1079px) {
    display: none;
  }
`;

const AppMobileWrapperMessageDiv = styled.div`
  display: flex;
  padding: 2rem;
  height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  @media only screen and (min-width: 1080px) {
    display: none;
  }
`;

const AppMobileWrapper = ({ children }: ChildProps) => {
  return (
    <>
      <AppMobileWrapperDiv>{children}</AppMobileWrapperDiv>
      <AppMobileWrapperMessageDiv>
        <Box
          sx={{
            marginBottom: '2rem',
          }}
        >
          <img src="/flow_logo.jpg" alt="Flow Logo" width="160" height="160" />
        </Box>
        <Text
          sx={{
            marginBottom: '4rem',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          The Flow Playground is best used on larger screens.
        </Text>
        <Box>
          <Button
            onClick={() => {
              window.location.href = 'https://www.onflow.org';
            }}
          >
            Visit Flow&apos;s Website
          </Button>
        </Box>
      </AppMobileWrapperMessageDiv>
    </>
  );
};

export default AppMobileWrapper;
