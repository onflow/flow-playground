import { useState } from 'react';

function useToggleExplorer() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExplorer = () => {
    setIsCollapsed(!isCollapsed);
  };

  return { isCollapsed, toggleExplorer };
}

export default useToggleExplorer;
