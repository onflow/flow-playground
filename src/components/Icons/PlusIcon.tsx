import React from 'react';
import { IconButton, useThemeUI } from 'theme-ui';

function PlusIcon({ primary }: { primary?: boolean }) {
  const context = useThemeUI();
  const { theme } = context;
  const color = primary ? String(theme.colors.primary) : 'text';
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        stroke={color}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 3.333v9.334M3.333 8h9.334"
        />
      </svg>
    </IconButton>
  );
}

export default PlusIcon;
