import Button from 'components/Button';
import React from 'react';
import { useColorMode } from 'theme-ui';
import { DARK, LIGHT } from 'util/globalConstants';
import SunIcon from 'components/Icons/SunIcon';
import MoonIcon from 'components/Icons/MoonIcon';

export const ThemeToggle = () => {
  const [mode, setMode] = useColorMode();

  const toggle = () => {
    setMode(mode === DARK ? LIGHT : DARK);
  };

  console.log('mode', mode);
  return (
    <>
      <Button
        sx={{ width: 'unset' }}
        onClick={() => toggle()}
        variant="secondary"
        size="sm"
      >
        {mode === DARK ? <SunIcon /> : <MoonIcon />}
      </Button>
    </>
  );
};
