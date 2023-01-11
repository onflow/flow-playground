import React from 'react';
import { Box, Flex, Link } from 'theme-ui';
import { ThemeUICSSObject, Button } from 'theme-ui';
import theme from '../theme';

type SXStyles = Record<string, ThemeUICSSObject>;

const styles: SXStyles = {
  root: {
    flexDirection: 'column',
    zIndex: 99,
    position: 'absolute',
    top: '100px',
    right: '100px',
    width: '500px',
    background: theme.colors.primary,
    color: theme.colors.text,
    opacity: '0.75',
    padding: '12px',
    borderRadius: '8px',
    alignItems:'center'

  },
  header: {
    padding: '4px',
  },
  content: {
    padding: '4px'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '400px',
    padding: '8px',

  },
  button: {
    padding: '8px',
    border: 'solid 1px black',
    borderRadius: '8px',
    background: theme.colors.background,
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      background: theme.colors.grey,
      opacity: '0.75'
    }
  }
}


const BetaFunnel = ({setCookie}: {setCookie: any}) => {

  const closeFunnel = () => {
    const today = new Date();
    const expirationMS = 30 * 24 * 60 * 60 * 1000;
    const nextMonth = new Date(today.getTime() + expirationMS);
    setCookie('playgroundFunnel', true, {path: '/', expires: nextMonth});
  }

  return(
    <Flex sx={styles.root}>
      <Flex sx={styles.header}>
        <Box>
          Beta Playground Available!
        </Box>
      </Flex>
      <Box sx={styles.content}>
        Yo do you wana check out this cool new playground click this link and see for urself. i promise this not a scam pls just click the link pls im so lonely
      </Box>
      <Flex sx={styles.buttons}>
        <Link
          sx={styles.button}
          href="https://beta.play.flow.com/"
          target="_blank"
        
        >
          Wow take me there!
        </Link>
        <Button
          sx={styles.button}
          onClick={closeFunnel}
          variant='secondary'
        >
          Nah go away scammer
        </Button>
      </Flex>
    </Flex>
  )
}

export default BetaFunnel;