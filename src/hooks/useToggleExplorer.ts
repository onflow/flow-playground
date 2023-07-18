import { isMobile } from 'components/Editor/CadenceEditor/ControlPanel/utils';
import { useState } from 'react';

function useToggleExplorer() {
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(isMobile());

  const toggleExplorer = () => {
    setIsExplorerCollapsed(!isExplorerCollapsed);
  };

  return { isExplorerCollapsed, toggleExplorer };
}

export default useToggleExplorer;
