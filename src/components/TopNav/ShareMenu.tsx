import Button from 'components/Button';
import CopyIcon from 'components/Icons/CopyIcon';
import Mixpanel from 'util/mixpanel';
import useClipboard from 'react-use-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Container, Flex, Input, Text } from 'theme-ui';
import theme from '../../theme';
import AnchorIcon from 'components/Icons/AnchorIcon';
import ShareIcon from 'components/Icons/ShareIcon';
import InfoIcon from 'components/Icons/InfoIcon';
import { useProject } from 'providers/Project/projectHooks';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.borderColor}`,
    boxShadow: `0px 4px 40px rgba(0, 0, 0, 0.08)`,
    position: 'absolute',
    zIndex: '15',
    right: '170px',
    margin: '0',
    background: theme.colors.white,
    padding: '1rem',
  },
  copyLink: {
    flexDirection: 'row',
    paddingBottom: '12px',
  },
  ctaButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '113px',
    marginLeft: '4px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '4px',
    height: '48px',
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
  linkInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px',
    width: '363px',
    background: '#F6F7F9',
    border: '1px solid #DEE2E9',
    borderRadius: '4px',
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export const ShareMenu = () => {
  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { project } = useProject();

  // todo: verify Project persist is true when project is saved.
  const isSaved = project.persist;

  const copyLink = () => {
    setCopied();
    Mixpanel.track('Share link copied', { url });
  };

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Container sx={styles.container} ref={ref}>
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        variant="alternate"
        size="sm"
        inline={true}
        disabled={!isSaved}
      >
        Share
        {isOpen ? <AnchorIcon /> : <ShareIcon />}
      </Button>
      {isOpen && (
        <Flex sx={styles.menu}>
          <Flex sx={styles.copyLink}>
            <Input sx={styles.linkInput} defaultValue={url} />
            <Button
              onClick={copyLink}
              variant="primary"
              size="sm"
              sx={styles.ctaButton}
            >
              {!isCopied ? 'Copy URL' : 'Copied!'}
              <CopyIcon />
            </Button>
          </Flex>
          <Text sx={styles.message}>
            <InfoIcon /> Your current page will be where your share link lands.
          </Text>
        </Flex>
      )}
    </Container>
  );
};
