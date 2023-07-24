import { Account, Project } from 'api/apollo/generated/graphql';
import { Editor as EditorRoot } from 'layout/Editor';
import { ActiveEditor } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useRef, useState } from 'react';
import { Flex, useThemeUI } from 'theme-ui';
import EditorPanels from 'components/Editor/EditorPanels';
import { SXStyles } from 'src/types';
import { decodeText } from 'util/readme';

export interface WithShowProps {
  show: boolean;
}

type EditorContainerProps = {
  isLoading: boolean;
  project: Project;
  active: ActiveEditor;
};

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
};

// This method
const compareContracts = (prev: Account[], current: Account[]) => {
  for (let i = 0; i < prev.length; i++) {
    if (prev[i].deployedContracts !== current[i].deployedContracts) {
      return false;
    }
  }
  return true;
};

const EditorContainer = ({
  isLoading,
  project,
  active,
}: EditorContainerProps) => {
  const [title, setTitle] = useState<string | undefined>(
    decodeText(project.title),
  );
  const [description, setDescription] = useState<string | undefined>(
    decodeText(project.description),
  );
  const [readme, setReadme] = useState<string | undefined>(project.readme);

  const projectAccess = useProject();

  useEffect(() => {
    if (isLoading) {
      setTitle('');
      setDescription('');
    } else {
      setTitle(title);
      setDescription(description);
      setReadme(readme);
    }
  }, [isLoading, active, projectAccess.project]);

  const previousProjectState = usePrevious(project);

  // This hook will listen for project updates and if one of the contracts has been changed,
  // it will reload language server
  useEffect(() => {
    if (previousProjectState !== undefined) {
      // @ts-expect-error TODO: add typing
      const previousAccounts = previousProjectState.accounts || [];
      const equal = compareContracts(previousAccounts, project.accounts);
      if (!equal) {
        // reloadServer()
      }
    }
  }, [project]);

  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    editorContainer: {
      gridArea: 'main',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexGrow: 1,
      margin: ['0', '8px 8px 0 8px'],
      background: theme.colors.primary,
    },
  };

  return (
    <Flex sx={styles.editorContainer}>
      <EditorRoot>
        <EditorPanels show={true} />
      </EditorRoot>
    </Flex>
  );
};

export { EditorContainer };
