import React from 'react';
import { SXStyles } from 'src/types';
import { Box } from 'theme-ui';
import ProjectsList from './ProjectsList';

export const LEFT_SIDEBAR_WIDTH = 350;

const styles: SXStyles = {
  root: {
    width: LEFT_SIDEBAR_WIDTH,
    zIndex: 10,
    position: 'fixed',
    left: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'alternateButtonBackground',
  },
};

const LeftSidebar = () => {
  const rootStyles = {
    ...styles.root,
  };
  return (
    <Box sx={rootStyles}>
      <ProjectsList />
    </Box>
  );
};

export default LeftSidebar;
