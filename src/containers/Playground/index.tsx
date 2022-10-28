import { Redirect } from '@reach/router';
import React from 'react';
import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';
import { LOCAL_PROJECT_ID } from 'util/url';
import EditorLayout from './EditorLayout';
import { Container, ThemeUICSSObject } from 'theme-ui';
import useToggleExplorer from '../../hooks/useToggleExplorer';

const Playground: any = (props: any) => {
  const { projectId } = props;
  const isLocalProject = projectId === LOCAL_PROJECT_ID;
  const { isCollapsed, toggleExplorer } = useToggleExplorer();

  const styles: ThemeUICSSObject = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100vh',
    display: 'grid',
    gridGap: '1px 1px',
    gridTemplateAreas: "'header header' 'sidebar main'",
    gridTemplateColumns: `${isCollapsed ? '65px' : '244px'} auto`,
    gridTemplateRows: '50px auto',
    background: 'greyBorder',
    overflow: 'hidden',
  };

  if (!projectId) {
    return <Redirect noThrow to={`/${LOCAL_PROJECT_ID}`} />;
  }

  return (
    <Container sx={styles}>
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <CadenceChecker>
          <EditorLayout />
        </CadenceChecker>
      </ProjectProvider>
    </Container>
  );
};

export default Playground;
