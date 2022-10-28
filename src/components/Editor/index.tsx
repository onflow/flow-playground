import { Project } from 'api/apollo/generated/graphql';
import FileExplorer from 'components/Editor/FileExplorer';
import TopNav from 'components/TopNav';
import { EditorContainer } from 'containers/Playground/components';
import { ActiveEditor } from 'providers/Project';
import React from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'inherit',
  },
  ide: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    height: '100%',
  },
};

type EditorContainerProps = {
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

const Editor = ({ isLoading, project, active }: EditorContainerProps) => {
  return (
    <Flex>
      <TopNav />
      <Flex>
        <FileExplorer />
        <EditorContainer
          isLoading={isLoading}
          project={project}
          active={active}
        />
      </Flex>
    </Flex>
  );
};

export default Editor;
