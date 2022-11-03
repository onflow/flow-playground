import { useState } from 'react';

function useToggleExplorer() {
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);

  const toggleExplorer = () => {
    setIsExplorerCollapsed(!isExplorerCollapsed);
  };

  return { isExplorerCollapsed, toggleExplorer };
}

export default useToggleExplorer;
