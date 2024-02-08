import React from 'react';
import { IconButton, useThemeUI } from 'theme-ui';

function TimesIcon({ primary }: { primary?: boolean }) {
  const context = useThemeUI();
  const { theme } = context;
  const color = primary ? String(theme.colors.primary) : 'text';
  return (
    <IconButton>
      <svg viewBox="0 0 15 15" width="14" height="14">
        <g stroke={color} strokeWidth="3.1">
          <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25" />
        </g>
      </svg>
    </IconButton>
  );
}

export default TimesIcon;
