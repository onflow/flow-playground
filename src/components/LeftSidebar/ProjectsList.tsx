import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS } from 'api/apollo/queries';
import React from 'react';
import { MockProject, SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import LeftSidebarSection from './LeftSidebarSection';
import ProjectListItem from './ProjectListItem';

const styles: SXStyles = {
  root: {
    flexDirection: 'column',
  },
};

const ProjectsList = () => {
  const { loading, error, data } = useQuery<{ projects: MockProject[] }>(
    GET_PROJECTS,
  );
  if (loading || !!error) return null;

  const projects = data?.projects || [];
  return (
    <Flex sx={styles.root}>
      <LeftSidebarSection title="Projects">
        {projects.length === 0 && '0 Projects'}
        {projects.map((project: MockProject) => (
          <ProjectListItem project={project} key={project.id} />
        ))}
      </LeftSidebarSection>
    </Flex>
  );
};

export default ProjectsList;
