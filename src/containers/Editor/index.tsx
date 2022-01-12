import React from 'react';
import { ProjectProvider } from 'providers/Project';
import EditorLayout from './layout';
import { Base } from 'layout/Base';
import { LOCAL_PROJECT_ID } from 'util/url';

const Playground: any = (props: any) => {
  const { projectId } = props;
  const isLocalProject = projectId === LOCAL_PROJECT_ID;

  return (
    <Base>
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Playground;
