import AccountList from 'components/Editor/FileExplorer/AccountList';
import React from 'react';
import { SXStyles } from 'src/types';
import { useProject } from 'providers/Project/projectHooks';
import { Flex } from 'theme-ui';
import FilesList from './FilesList';
import Button from 'components/Button';
import ExplorerCollapseIcon from 'components/Icons/ExplorerCollapseIcon';
import useToggleExplorer from '../../../hooks/useToggleExplorer';

const styles: SXStyles = {
  root: {
    overFlowY: 'auto',
    background: ' #F6F7F9',
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '24px 8px 24px 24px',
    width: '222px',
  },
  shutterOpened: {
    position: 'absolute',
    padding: '0px',
    left: '215px',
    top: '69px',
    borderRadius: '8px',
  },
  shutterClosed: {
    position: 'absolute',
    padding: '0px',
    left: '215px',
    top: '69px',
    borderRadius: '8px',
    transform: 'rotate(180deg)',
  },
};

const FileExplorer: React.FC = () => {
  const { isLoading } = useProject();
  const { isExplorerCollapsed, toggleExplorer } = useToggleExplorer();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.content}>
        <FilesList />
        <AccountList />
      </Flex>

      <Button sx={isExplorerCollapsed ? styles.shutterClosed : styles.shutterOpened} inline={true} variant="secondaryLegacy" onClick={toggleExplorer}>
        <ExplorerCollapseIcon />
      </Button>

    </Flex>
  );
};

export default FileExplorer;
