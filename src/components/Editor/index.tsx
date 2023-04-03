import { Project } from 'api/apollo/generated/graphql';
import FileExplorer from 'components/Editor/FileExplorer';
import TopNav from 'components/TopNav';
import { EditorContainer } from 'containers/Playground/components';
import { ActiveEditor } from 'providers/Project';
import React from 'react';
import ErrorToastContainer from './ErrorToastContainer';

type EditorContainerProps = {
  isExplorerCollapsed: boolean;
  toggleExplorer: () => void;
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

const Editor = ({
  isExplorerCollapsed,
  toggleExplorer,
  isLoading,
  project,
  active,
}: EditorContainerProps) => {
  return (
    <>
      <TopNav />
      <FileExplorer
        isExplorerCollapsed={isExplorerCollapsed}
        toggleExplorer={toggleExplorer}
      />
      <EditorContainer
        isLoading={isLoading}
        project={project}
        active={active}
      />
      <ErrorToastContainer />
    </>
  );
};

export default Editor;
