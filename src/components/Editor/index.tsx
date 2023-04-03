import { Project } from 'api/apollo/generated/graphql';
import CookieDetector from 'components/BrowserDetector';
import FileExplorer from 'components/Editor/FileExplorer';
import TopNav from 'components/TopNav';
import UnsupportedMessage from 'components/UnsupportedBrowser';
import { EditorContainer } from 'containers/Playground/components';
import { ActiveEditor } from 'providers/Project';
import React from 'react';
import ErrorToastContainer from './ErrorToastContainer';

const { detect } = require('detect-browser');
const browser = detect();

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
      {browser && browser.name === 'safari' ? (
        <UnsupportedMessage />
      ) : (
        <TopNav />
      )}
      <CookieDetector />
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
