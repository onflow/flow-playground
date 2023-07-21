import React from 'react';
import { useThemeUI } from 'theme-ui';

function InfoIcon() {
  const context = useThemeUI();
  const { theme } = context;
  const color = String(theme?.colors?.icons) || '#000';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill={color}
        d="M7.333 6h1.333V4.667H7.333V6zM8 13.333A5.34 5.34 0 012.666 8 5.34 5.34 0 018 2.667 5.34 5.34 0 0113.333 8 5.34 5.34 0 018 13.333zm0-12a6.667 6.667 0 100 13.334A6.667 6.667 0 008 1.333zm-.667 10h1.333v-4H7.333v4z"
      />
    </svg>
  );
}

export default InfoIcon;
