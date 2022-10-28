import { Redirect } from '@reach/router';
import React from 'react';
import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';
import { LOCAL_PROJECT_ID } from 'util/url';
import EditorLayout from './EditorLayout';
import { Container, ThemeUICSSObject } from 'theme-ui';

const getBaseStyles = (
  showFileExplorer: boolean,
): ThemeUICSSObject => {
  const fileExplorerWidth = showFileExplorer ? '244px' : '65px';

  return {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100vh',
    display: 'grid',
    'grid-gap': '1px 1px',
    'grid-template-areas': "'header header' 'sidebar main'",
    'grid-template-columns': `${fileExplorerWidth} auto`,
    'grid-template-rows': '50px auto',
    background: 'greyBorder',
    overflow: 'hidden',
  };
};

const Playground: any = (props: any) => {
  const { projectId } = props;
  const isLocalProject = projectId === LOCAL_PROJECT_ID;
  const styles = getBaseStyles(true);

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
