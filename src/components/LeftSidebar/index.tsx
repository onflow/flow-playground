import NewProjectButton from 'components/LeftSidebar/NewProjectButton';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useRef } from 'react';
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

const LeftSidebar = () => {
  const { toggleProjectsSidebar } = useProject();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        toggleProjectsSidebar();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Box sx={styles.root} ref={ref}>
      <Box mb={12}>
        <NewProjectButton
          label="Create New Project"
          size="md"
          variant="secondary"
          delayTooltipShow={300} // Wait for sidebar animation to complete
        />
      </Box>
      <ProjectsList />
    </Box>
  );
};

export default LeftSidebar;
