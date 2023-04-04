import React from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import theme from '../theme';

const styles: SXStyles = {
  root: {
    background: 'white',
    display: 'flex',
    gridArea: 'header',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '1em',
    paddingRight: '1em',
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0.25rem',
    margin: '0.05rem',
    color: theme.colors.error,
    borderRadius: '8px',
    border: `1px solid ${theme.colors.errors}`,
    background: theme.colors.errorBackground,
    fontSize: theme.fontSizes[3],
    fontWeight: `700`,
  },
};

const UnsupportedMessage = () => {
  return (
    <Flex sx={styles.root}>
      <Box sx={styles.message}>
        This is an unsupported browser. We hope to support your browser in the
        future. In order to have the best experience, we recommend you use
        either Chrome or Firefox to access the Flow Playground.
      </Box>
    </Flex>
  );
};

export default UnsupportedMessage;
