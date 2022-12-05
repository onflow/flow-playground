import NewProjectButton from 'components/NewProjectButton';
import React from 'react';
import { SXStyles } from 'src/types';
import { Box } from 'theme-ui';
import ProjectsList from './ProjectsList';

const styles: SXStyles = {
  root: {
    backgroundColor: 'leftSidebarBackground',
    padding: 8,
    minHeight: '100%',
  },
};

const LeftSidebar = ({ reference }: { reference: any }) => {
  return (
    <Box sx={styles.root} ref={reference}>
      <Box mb={12}>
        <NewProjectButton
          label="Create New Project"
          size="md"
          variant="primary"
          delayTooltipShow={300} // Wait for sidebar animation to complete
        />
      </Box>
      <ProjectsList />
    </Box>
  );
};

export default LeftSidebar;
