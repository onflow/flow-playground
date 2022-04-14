import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from 'theme-ui';

import theme from '../../../theme';

export const ToastContainer = styled.div`
  z-index: 1000;
  position: fixed;
  bottom: 40px;
  left: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.colors.darkPrimary};
`;

export const RemoveToastButton = styled.button`
  border: none;
  background: transparent;
  transform: translate(25%, 50%);
  color: ${theme.colors.grey};
  &:hover {
    color: ${theme.colors.heading};
  }
`;

export const ButtonContainer = ({ children }) => {
  return (
    <Flex
      sx={{
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </Flex>
  );
};

export const ContentBox = ({ children }) => {
  const sx = {
    marginTop: '0.0rem',
    padding: '0.8rem 0.5rem',
    alignItems: 'center',
    border: `1px solid ${theme.colors.borderDark}`,
    backgroundColor: theme.colors.background,
    borderRadius: '8px',
    maxWidth: '500px',
    boxShadow: '10px 10px 20px #c9c9c9, -10px -10px 20px #ffffff',
  };
  return (
    <Box my={1} sx={sx}>
      {children}
    </Box>
  );
};

export const Content = ({ children }) => {
  const sx = {
    padding: '0.75rem',
  };
  return <Text sx={sx}>{children}</Text>;
};

export const SingleToast = (props: any) => {
  const { children } = props;
  const toastProps = {
    layout: true,
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };
  return <motion.li {...toastProps}>{children}</motion.li>;
};
