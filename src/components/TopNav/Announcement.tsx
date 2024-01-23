import React from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex, Link, useThemeUI } from 'theme-ui';

const Announcement = () => {
  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    root: {
      backgroundColor: 'white',
      flex: '1 1 auto',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#F27360',
      width: '100%',
      padding: '0.25rem 0 0.5rem',
      height: '60px',
      color: `${theme.colors.secondary}`,
    },
    message: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: `${theme.colors.secondary}`,
      fontSize: '14px',
      padding: '0.15rem',
    },
    devLink: {
      textDecoration: 'underline',
      color: `${theme.colors.secondary}`,
    },
  };

  return (
    <Flex sx={styles.root}>
      <Box sx={styles.message}>⚠ Upgrade to Cadence 1.0</Box>
      <Box sx={styles.message}>
        The Crescendo network upgrade, including Cadence 1.0, is coming soon.
        You most likely need to update all your contracts/transactions/scripts
        to support this change.
      </Box>
      <Box sx={styles.message}>
        Please visit our migration guide here:&nbsp;&nbsp;
        <Link
          sx={styles.devLink}
          target="_blank"
          href="https://cadence-lang.org/docs/cadence-migration-guide"
          rel="noreferrer"
          title="Report a Bug"
        >
          https://cadence-lang.org/docs/cadence-migration-guide
        </Link>
      </Box>
    </Flex>
  );
};

export default Announcement;
