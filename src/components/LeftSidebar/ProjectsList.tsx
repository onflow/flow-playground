import React from 'react';
import { ProjectType, SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
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
};

const ProjectsList = () => {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <Flex sx={styles.root}>
      {projects.length === 0 && !loading && '0 Projects'}
      {projects.length === 0 && loading && 'Loading...'}
      {error && 'Error loading projects'}
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
