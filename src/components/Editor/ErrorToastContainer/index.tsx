import Button from 'components/Button';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex, Link, useThemeUI } from 'theme-ui';
import ErrorToast from './ErrorToast';
import { PLAYGROUND_GITHUB_ISSUES_URL } from 'util/globalConstants';

const ErrorToastContainer = () => {
  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    root: {
      zIndex: 1000,
      position: 'fixed',
      bottom: '40px',
      left: '40%',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.colors.error,
    },
    errorContent: {
      flexDirection: 'row',
      maxWidth: '500px',
      marginTop: '0.0rem',
      padding: '16px 0px 16px 24px',
      alignItems: 'center',
      fontSize: theme.fontSizes[2],
      border: `1px solid ${theme.colors.errorToast}`,
      background: theme.colors.errorBackground,
      borderRadius: '8px',
      boxShadow: `10px 10px 20px #c9c9c9, -10px -10px 20px ${theme.colors.secondary}`,
    },
    issuesLink: {
      textDecoration: 'none',
      fontSize: '12px',
      color: theme.colors.errorToast,
      paddingRight: '10px',
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '210px',
    },
    closeToastButton: {
      borderLeft: `1px solid ${theme.colors.errorToast}`,
      background: 'none',
      color: theme.colors.errorToast,
      padding: '0px',
      borderRadius: '0px',
      width: '40px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    message: {
      paddingRight: '24px',
      overflowWrap: 'anywhere',
      maxWidth: '339px',
      color: theme.colors.text,
    },
  };

  const {
    applicationErrorMessage,
    setApplicationErrorMessage,
    clearApplicationErrors,
  } = useProject();
  const errorMessage = applicationErrorMessage ?? '';

  const onCloseToastClicked = () => {
    setApplicationErrorMessage('');
    clearApplicationErrors();
  };

  return (
    <Flex sx={styles.root}>
      {errorMessage.length > 0 && (
        <ErrorToast>
          <Flex sx={styles.errorContent}>
            <Box sx={styles.message}>{errorMessage}</Box>
            <Flex sx={styles.buttonContainer}>
              <Link
                sx={styles.issuesLink}
                rel="noreferrer"
                title="Report a Bug"
                href={PLAYGROUND_GITHUB_ISSUES_URL}
                target="_blank"
              >
                <p>Submit an Issue</p>
              </Link>
              <Button
                variant="unstyled"
                sx={styles.closeToastButton}
                onClick={onCloseToastClicked}
              >
                x
              </Button>
            </Flex>
          </Flex>
        </ErrorToast>
      )}
    </Flex>
  );
};

export default ErrorToastContainer;
