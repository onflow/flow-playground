import AccountList from 'components/Editor/FileExplorer/AccountList';
import React from 'react';
import { SXStyles } from 'src/types'
import { useProject } from 'providers/Project/projectHooks';
import { Flex } from 'theme-ui'
import FilesList from './FilesList';
import ExplorerArrowIcon from 'components/Icons/ExplorerArrowIcon';

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
    padding: '24px',
    width: '222px',
  },
  shutter: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    left: '200px',
    top: '65px',
    borderRadius: '8px 0px 0px 8px',
    padding: 0
  },
}

const FileExplorer: React.FC = () => {
  const {
    isLoading,
  } = useProject();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Flex sx={styles.root} >
      <Flex sx={styles.content} >
        <FilesList />
        <AccountList />
      </Flex>
      <Flex sx={styles.shutter} >
        <ExplorerArrowIcon />
      </Flex>
    </Flex>
  );
};

export default FileExplorer;
