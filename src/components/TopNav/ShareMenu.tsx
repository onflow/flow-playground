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
    zIndex: '11',
    left: '150px',
    margin: '0',
    background: theme.colors.white,
    padding: '1rem',
  },
}

export const ShareMenu = () => {
  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  return(
    <Container sx={styles.container}>
      <Button
        onClick={() => {setIsOpen(!isOpen)}}
        variant="alternate"
        size="sm"
        inline={true}
      >
        Share
        {isOpen ? <AnchorIcon/> : <ShareIcon/>}
      </Button>
      {isOpen && (
        <Flex sx={styles.menu}>
          <Flex>
            <Input
              defaultValue={url}
            />
            <Button
              onClick={copyLink}
              variant='primary'
              size='sm'
            >
              {!isCopied ? 'Copy URL' : 'Copied!'}
              <CopyIcon/>
            </Button>
          </Flex>
          <Text>
            <InfoIcon/> Your current page will be where your share link lands. 
          </Text>
        </Flex>
      )}
    </Container>
  )
}