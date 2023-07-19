import React from 'react';
import { IconButton } from 'theme-ui';

function ProjectsIcon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 14 14"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5.833 1.75H1.75v4.083h4.083V1.75zM12.25 1.75H8.167v4.083h4.083V1.75zM12.25 8.166H8.167v4.084h4.083V8.166zM5.833 8.166H1.75v4.084h4.083V8.166z"
        />
      </svg>
    </IconButton>
  );
}

export default ProjectsIcon;
