import React from 'react';
import { IconButton } from 'theme-ui';

function Icon() {
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
          strokeWidth="1.5"
          d="M3.333 5.5H6a1 1 0 001-1V2M3.333 5.5v0c0-.32.13-.624.363-.844l2.44-2.311C6.368 2.123 6.677 2 7 2v0M3.333 5.5v7a1.5 1.5 0 001.5 1.5h6.333a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5H7"
        />
      </svg>
    </IconButton>
  );
}

export default Icon;
