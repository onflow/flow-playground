import { useState } from 'react';
import theme from '../theme';

function useToggleExplorer() {
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(
    theme.isMobile,
  );

  const toggleExplorer = () => {
    setIsExplorerCollapsed(!isExplorerCollapsed);
  };

  return { isExplorerCollapsed, toggleExplorer };
}

export default useToggleExplorer;
