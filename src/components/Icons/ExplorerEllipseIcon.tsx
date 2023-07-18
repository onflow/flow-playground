import React from 'react';
import { IconButton, useThemeUI } from 'theme-ui';

function ExplorerEllipseIcon() {
  const context = useThemeUI();
  const { theme } = context;
  const color = String(theme?.colors?.icons) || '#000';
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="none"
        viewBox="0 0 32 32"
      >
        <path fill={color} d="M20 16a2 2 0 114 0 2 2 0 01-4 0zm-6 0a2 2 0 114 0 2 2 0 01-4 0zm-6 0a2 2 0 114 0 2 2 0 01-4 0z" />
      </svg>
    </IconButton>
  );
}

export default ExplorerEllipseIcon;
