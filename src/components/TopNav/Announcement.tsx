import TimesIcon from 'components/Icons/TimesIcon';
import { AnnouncementContext } from 'providers/Announcement';
import React, { useContext } from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex, IconButton, Link, useThemeUI } from 'theme-ui';

const Announcement = () => {
  const context = useThemeUI();
  const { theme } = context;

  const { toggleAnnouncement } = useContext(AnnouncementContext);

  const styles: SXStyles = {
    root: {
      width: '100%',
      backgroundColor: 'white',
      flex: '1 1 auto',
      flexDirection: 'row',
      background: '#007BFF',
      padding: '0.25rem 0 0.5rem',
      height: '60px',
      color: `${theme.colors.secondary}`,
      justifyContent: 'space-around',
      alignContent: 'center',
    },
    content: {
      flex: '1 1 auto',
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'center',
    },
    message: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: `${theme.colors.secondary}`,
      fontSize: '14px',
      padding: '0.15rem',
      gap: '4px',
    },
    devLink: {
      textDecoration: 'underline',
      color: `${theme.colors.secondary}`,
    },
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.content}>
        <Box sx={styles.message}>🔧 Upgrade to Cadence 1.0 🔧</Box>
        <Box sx={styles.message}>
          The highly anticipated
          <Link
            sx={styles.devLink}
            target="_blank"
            rel="noreferrer"
            href="https://flow.com/upgrade/crescendo"
          >
            Crescendo
          </Link>
          network upgrade is coming soon with 20+ new
          <Link
            sx={styles.devLink}
            target="_blank"
            rel="noreferrer"
            href="https://flow.com/upgrade/cadence-1"
          >
            Cadence 1.0
          </Link>
          features and
          <Link
            sx={styles.devLink}
            target="_blank"
            rel="noreferrer"
            href="https://flow.com/upgrade/evm"
          >
            EVM
          </Link>
          equivalence.
        </Box>
      </Flex>
      <IconButton size="lg" onClick={toggleAnnouncement}>
        <TimesIcon primary />
      </IconButton>
    </Flex>
  );
};

export default Announcement;
