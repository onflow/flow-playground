import { motion } from 'framer-motion';
import React from 'react';
import { ChildProps, ThemedComponentProps } from 'src/types';
import styled from 'styled-components';
import { Box, Flex, Text, useThemeUI } from 'theme-ui';

export const ToastContainer = styled.div<ThemedComponentProps>`
  z-index: 1000;
  position: fixed;
  bottom: 40px;
  left: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.accent};
`;

export const RemoveToastButton = styled.button<ThemedComponentProps>`
  border: none;
  background: transparent;
  transform: translate(25%, 50%);
  color: ${({ theme }) => theme.colors.border};
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ButtonContainer = ({ children }: ChildProps) => {
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

export const ContentBox = ({ children }: ChildProps) => {
  const context = useThemeUI();
  const { theme } = context;

  const sx = {
    marginTop: '0.0rem',
    padding: '0.8rem 0.5rem',
    alignItems: 'center',
    border: `1px solid ${theme.colors.shadow}`,
    backgroundColor: theme.colors.background,
    borderRadius: '8px',
    maxWidth: '500px',
    boxShadow: `10px 10px 20px ${theme.colors.shadow}, -10px -10px 20px ${theme.colors.primary}`,
  };
  return (
    <Box my={1} sx={sx}>
      {children}
    </Box>
  );
};

export const Content = ({ children }: ChildProps) => {
  const sx = {
    padding: '0.75rem',
  };
  return <Text sx={sx}>{children}</Text>;
};

export const SingleToast = (props: ChildProps) => {
  const { children } = props;
  const toastProps = {
    layout: true,
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };
  return <motion.li {...toastProps}>{children}</motion.li>;
};
