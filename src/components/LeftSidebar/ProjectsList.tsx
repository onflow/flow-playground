import React from 'react';
import { MockProject, SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import useProjects from '../../hooks/useProjects';
import LeftSidebarSection from './LeftSidebarSection';
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
  const { projects, loading, error } = useProjects();

  if (loading || !!error) return null;

  return (
    <Flex sx={styles.root}>
      <LeftSidebarSection title="Projects">
        {projects.length === 0 && '0 Projects'}
        <Flex sx={styles.items}>
          {projects.map((project: MockProject) => (
            <ProjectListItem
              project={project}
              key={project.id}
              projectCount={projects.length}
            />
          ))}
        </Flex>
      </LeftSidebarSection>
    </Flex>
  );
};

export default ProjectsList;
