import { Project } from 'api/apollo/generated/graphql';
import FileExplorer from 'components/Editor/FileExplorer';
import TopNav from 'components/TopNav';
import { EditorContainer } from 'containers/Playground/components';
import { ActiveEditor } from 'providers/Project';
import React from 'react';

type EditorContainerProps = {
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

const Editor = ({ isLoading, project, active }: EditorContainerProps) => {
  return (
    <>
      <TopNav />
      <FileExplorer />
      <EditorContainer
        isLoading={isLoading}
        project={project}
        active={active}
      />
    </>
  );
};

export default Editor;
