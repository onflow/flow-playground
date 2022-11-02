import AccountList from 'components/Editor/FileExplorer/AccountList';
import React from 'react';
import { SXStyles } from 'src/types';
import { useProject } from 'providers/Project/projectHooks';
import { Flex } from 'theme-ui';
import FilesList from './FilesList';
import Button from 'components/Button';
import ExplorerCollapseIcon from 'components/Icons/ExplorerCollapseIcon';

type FileExplorerProps = {
  isExplorerCollapsed: boolean;
  toggleExplorer: () => void;
};

const styles: SXStyles = {
  root: {
    background: ' #F6F7F9',
    flexDirection: 'row',
    display: 'flex',
    gridArea: 'sidebar',
  },
  collapsedRoot: {
    background: ' #F6F7F9',
    display: 'flex',
    flexDirection: 'column',
    gridArea: 'sidebar',
    alignItems: 'center',
    justifyContent: 'start',
    paddingTop: '24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '24px',
    width: '100%',
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
    borderRadius: '8px',
    transform: 'rotate(180deg)',
  },
};

const FileExplorer = ({
  isExplorerCollapsed,
  toggleExplorer,
}: FileExplorerProps) => {
  const { isLoading } = useProject();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Flex sx={isExplorerCollapsed ? styles.collapsedRoot : styles.root}>
      <Flex sx={styles.content}>
        <FilesList isExplorerCollapsed={isExplorerCollapsed} />
        <AccountList isExplorerCollapsed={isExplorerCollapsed} />
      </Flex>

      <Button
        sx={isExplorerCollapsed ? styles.shutterClosed : styles.shutterOpened}
        inline={true}
        variant="secondaryLegacy"
        onClick={toggleExplorer}
      >
        <ExplorerCollapseIcon />
      </Button>
    </Flex>
  );
};

export default FileExplorer;
