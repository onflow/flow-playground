import React from 'react';
import { ProjectType, SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import useProjects from '../../hooks/useProjects';
import ProjectListItem from './ProjectListItem';

const styles: SXStyles = {
  root: {
    flexDirection: 'column',
  },
  items: {
    gap: 8,
    flexDirection: 'column',
  },
  error: {
    alignSelf: 'center',
    padding: '1rem 0',
    color: 'red',
  }
};

const ProjectsList = () => {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <Flex sx={styles.root}>
      {!error && projects.length === 0 && !loading && '0 Projects'}
      {!error && projects.length === 0 && loading && 'Loading...'}
      {error && <Box sx={styles.error}>Error: Loading Projects</Box>}
      <Flex sx={styles.items}>
        {projects.map((project: ProjectType) => (
          <ProjectListItem
            project={project}
            key={project.id}
            projectCount={projects.length}
            refetch={refetch}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default ProjectsList;
