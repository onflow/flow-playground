import { Redirect } from '@reach/router';
import React from 'react';
import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';
import { LOCAL_PROJECT_ID } from 'util/url';
import PlaygroundLayout from './layout';
import { Container } from 'theme-ui';
import { SXStyles } from 'src/types';

const styles: SXStyles = {
  root: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    padding: '0px'
  }
}

const Playground: any = (props: any) => {
  const { projectId } = props;
  const isLocalProject = projectId === LOCAL_PROJECT_ID;

  if (!projectId) {
    return <Redirect noThrow to={`/${LOCAL_PROJECT_ID}`} />;
  }

  return (
    <Container
      sx={styles.root}
    >
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <CadenceChecker>
          <PlaygroundLayout />
        </CadenceChecker>
      </ProjectProvider>
    </Container>
  );
};

export default Playground;
