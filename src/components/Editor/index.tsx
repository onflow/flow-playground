import { Project } from 'api/apollo/generated/graphql';
import CookieDetector from 'components/BrowserDetector';
import FileExplorer from 'components/Editor/FileExplorer';
import UnsupportedMessage from 'components/UnsupportedBrowser';
import { EditorContainer } from 'containers/Playground/components';
import { ActiveEditor } from 'providers/Project';
import React from 'react';
import ErrorToastContainer from './ErrorToastContainer';
import Header from 'components/TopNav/Header';

const { detect } = require('detect-browser');
const browser = detect();

type EditorContainerProps = {
  isExplorerCollapsed: boolean;
  toggleExplorer: () => void;
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
  isAnnouncementVisible: boolean;
};

const Editor = ({
  isExplorerCollapsed,
  toggleExplorer,
  isLoading,
  project,
  active,
  isAnnouncementVisible,
}: EditorContainerProps) => {
  return (
    <>
      {browser && browser.name === 'safari' ? (
        <UnsupportedMessage />
      ) : (
        <Header isAnnouncementVisible={isAnnouncementVisible} />
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
