import Button from 'components/Button';
import React from 'react';
import theme from '../../theme';
import { SXStyles } from 'src/types';
import InfoIcon from 'components/Icons/InfoIcon';
import { useColorMode } from 'theme-ui';
import { DARK, LIGHT } from 'util/globalConstants';

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  button: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    background: `${theme.colors.secondaryBackground}`,
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
};

export const ThemeToggle = () => {
  const [mode, setMode] = useColorMode();

  const toggle = () => {
    setMode(mode === DARK ? LIGHT : DARK);
  };

  console.log('mode', mode);
  return (
    <>
      <Button
        sx={{ ...styles.button, width: 'unset' }}
        onClick={() => toggle()}
        variant="secondary"
        size="sm"
      >
        <InfoIcon />
      </Button>
    </>
  );
};
