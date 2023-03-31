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

  if (loading || !!error) return null;

  return (
    <Flex sx={styles.root}>
      {projects.length === 0 && '0 Projects'}
      <Flex sx={styles.items}>
        {loading && 'Loading...'}
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
