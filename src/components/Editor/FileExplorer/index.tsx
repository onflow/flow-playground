import AccountList from 'components/Editor/FileExplorer/AccountList';
import React, { useState } from 'react';
import { SXStyles } from 'src/types';
import { useProject } from 'providers/Project/projectHooks';
import { Flex } from 'theme-ui';
import FilesList from './FilesList';
import Button from 'components/Button';
import ExplorerCloseShutterIcon from 'components/Icons/ExplorerCloseShutterIcon';
import ExplorerOpenShutterIcon from 'components/Icons/ExplorerOpenShutterIcon';
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
  shutter: {
    position: 'absolute',
    padding: 0,
    left: '200px',
    top: '60px',
    borderRadius: '8px',
  },
};

const FileExplorer: React.FC = () => {
  const { isLoading } = useProject();
  const { isCollapsed, toggleExplorer } = useToggleExplorer();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.content}>
        <FilesList />
        <AccountList />
      </Flex>
      <Flex sx={styles.shutter}>
        <Button variant="secondary" onClick={toggleExplorer}>
          {isCollapsed ? (
            <ExplorerCloseShutterIcon />
          ) : (
            <ExplorerOpenShutterIcon />
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default FileExplorer;
