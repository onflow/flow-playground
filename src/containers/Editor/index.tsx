import { Redirect } from '@reach/router';
import React from 'react';

import CadenceChecker from 'providers/CadenceChecker';
import { ProjectProvider } from 'providers/Project';

import { Base } from 'layout/Base';
import { LOCAL_PROJECT_ID } from 'util/url';
import EditorLayout from './layout';

const Playground: any = (props: any) => {
  const { projectId } = props;
  const isLocalProject = projectId === LOCAL_PROJECT_ID;

  if (!projectId) {
    return <Redirect noThrow to={`/${LOCAL_PROJECT_ID}`} />;
  }

  return (
    <Base>
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <CadenceChecker>
          <EditorLayout />
        </CadenceChecker>
      </ProjectProvider>
    </Base>
  );
};

export default Playground;
