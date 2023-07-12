import React from 'react';
import { IconButton } from 'theme-ui';

function PlusIcon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
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
