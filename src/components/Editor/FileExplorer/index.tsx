import Button from 'components/Button';
import AccountList from 'components/Editor/FileExplorer/AccountList';
import ExplorerCollapseIcon from 'components/Icons/ExplorerCollapseIcon';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import FilesList from './FilesList';

type FileExplorerProps = {
  isExplorerCollapsed: boolean;
  toggleExplorer: () => void;
};

const styles: SXStyles = {
  root: {
    flexDirection: 'row',
    display: 'flex',
    gridArea: 'sidebar',
    overflowY: 'auto',
  },
  collapsedRoot: {
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
    left: '205px',
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
        variant="explorer"
        onClick={toggleExplorer}
      >
        <ExplorerCollapseIcon />
      </Button>
    </Flex>
  );
};

export default FileExplorer;
