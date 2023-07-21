import React from 'react';
import { useThemeUI } from 'theme-ui';

function LearnCadenceIcon() {
  const context = useThemeUI();
  const { theme } = context;
  const color = String(theme?.colors?.icons) || '#000';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill={color}
        d="M8.24 2.13a.5.5 0 00-.48 0L1.472 5.56a.5.5 0 000 .879l1.6.872a.5.5 0 01.261.44v3.406a.5.5 0 00.26.438L7.76 13.87a.5.5 0 00.48 0l4.166-2.274a.5.5 0 00.26-.438V7.75a.5.5 0 01.261-.439l.334-.181a.5.5 0 01.739.439v3.264a.5.5 0 00.5.5h.333a.5.5 0 00.5-.5V6.297a.5.5 0 00-.26-.44L8.239 2.132zm3.502 3.431a.5.5 0 010 .878l-3.503 1.91a.5.5 0 01-.479 0L4.258 6.44a.5.5 0 010-.878l3.502-1.91a.5.5 0 01.48 0l3.502 1.91zm-.409 4.809a.5.5 0 01-.26.439L8.238 12.35a.5.5 0 01-.478 0l-2.833-1.541a.5.5 0 01-.261-.44V9.024a.5.5 0 01.74-.44L7.76 9.87a.5.5 0 00.48 0l2.354-1.285a.5.5 0 01.74.439v1.347z"
      />
    </svg>
  );
}

export default LearnCadenceIcon;
