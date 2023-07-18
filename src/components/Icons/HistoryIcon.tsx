import React from 'react';
import { IconButton } from 'theme-ui';

function HistoryIcon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <g
          stroke="#2F353F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          clipPath="url(#clip0_549_41682)"
        >
          <path d="M17.5 6.667V17.5h-15V6.667M19.167 2.5H.833v4.167h18.334V2.5zM8.334 10h3.333" />
        </g>
        <defs>
          <clipPath id="clip0_549_41682">
            <path fill="#fff" d="M0 0H20V20H0z" />
          </clipPath>
        </defs>
      </svg>
    </IconButton>
  );
}

export default HistoryIcon;
