import React from 'react';
import { SXStyles } from 'src/types';
import { Box } from 'theme-ui';
import ProjectsList from './ProjectsList';

export const LEFT_SIDEBAR_WIDTH = 350;

const styles: SXStyles = {
  root: {
    backgroundColor: 'leftSidebarBackground',
    padding: 8,
    minHeight: '100%',
  },
};

const LeftSidebar = () => {
  return (
    <Box sx={styles.root}>
      <ProjectsList />
    </Box>
  );
};

export default LeftSidebar;
