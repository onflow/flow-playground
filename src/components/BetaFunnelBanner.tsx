import React from 'react';
import { Box, Flex, Link } from 'theme-ui';
import { ThemeUICSSObject, Button } from 'theme-ui';
import theme from '../theme';

type SXStyles = Record<string, ThemeUICSSObject>;

const styles: SXStyles = {
  root: {
    flexDirection: 'row',
    width: '100%',
    background: 'rgb(145, 251, 158)',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    padding: '8px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  message: {
    paddingRight: '12px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '24px',
    background: 'white',
    textDecoration: 'none',
    color: theme.colors.text,
    '&:hover': {
      background: theme.colors.grey,
      opacity: '0.75',
    },
  },
  dismissButton: {
    padding: '8px',
    marginRight: '16px',
    background: 'rgb(145, 251, 158)',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      background: 'rgb(145, 251, 158)',
    },
  },
};

const BetaFunnelBanner = ({ setCookie }: { setCookie: any }) => {
  const closeFunnel = () => {
    const today = new Date();
    const expirationMS = 30 * 24 * 60 * 60 * 1000;
    const nextMonth = new Date(today.getTime() + expirationMS);
    setCookie('playgroundFunnel', true, { path: '/', expires: nextMonth });
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.content}>
        <Box sx={styles.message}>
          {String.fromCodePoint(0x1f389)} Playground v2 Beta is now available!
          Manage multiple projects, work with Cadence files and more!
        </Box>
        <Link
          sx={styles.button}
          href="https://beta.play.flow.com/"
          target="_blank"
        >
          Click Here
        </Link>
      </Flex>
      <Button
        sx={styles.dismissButton}
        onClick={closeFunnel}
        variant="secondary"
      >
        X
      </Button>
    </Flex>
  );
};

export default BetaFunnelBanner;
