import React from 'react';
import { IconButton, useThemeUI } from 'theme-ui';

function CollapseOpenIcon() {
  const context = useThemeUI();
  const { theme } = context;
  const color = String(theme?.colors?.text) || '#fff';

  return (
    <IconButton>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 5L5 1L1 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
}

export default CollapseOpenIcon;
