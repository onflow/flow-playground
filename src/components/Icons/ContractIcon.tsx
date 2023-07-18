import React from 'react';
import { IconButton, useThemeUI } from 'theme-ui';

function ContractIcon() {
  const context = useThemeUI();
  const { theme } = context;

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
          fill={String(theme.colors?.icon)}
          fillRule="evenodd"
          d="M11.862 1.276L5.529 7.61a.667.667 0 00-.176.31l-.666 2.667c-.122.488.32.93.808.808l2.667-.666a.666.666 0 00.31-.176l6.333-6.333a2.08 2.08 0 10-2.943-2.943zm2.058 1.008a.748.748 0 01-.058.992L7.659 9.478l-1.41.353.353-1.41 6.203-6.202a.748.748 0 011.057 0l.058.065zM8 2.748a.667.667 0 00-.667-.667H2.667l-.118.003A2 2 0 00.667 4.081v9.333l.003.118a2 2 0 001.997 1.882H12l.118-.003A2 2 0 0014 13.414V8.748l-.004-.078a.667.667 0 00-1.33.078v4.666l-.004.078a.667.667 0 01-.662.589H2.667l-.078-.005A.667.667 0 012 13.414V4.081l.005-.078a.667.667 0 01.662-.589h4.666l.078-.004a.667.667 0 00.59-.662z"
          clipRule="evenodd"
        />
      </svg>
    </IconButton>
  );
}

export default ContractIcon;
