import React from 'react';
import { IconButton } from 'theme-ui';

function LogIcon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="#2F353F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6.667 5H17.5M6.667 10H17.5M6.667 15H17.5M2.5 5h.008M2.5 10h.008M2.5 15h.008"
        />
      </svg>
    </IconButton>
  );
}

export default LogIcon;
