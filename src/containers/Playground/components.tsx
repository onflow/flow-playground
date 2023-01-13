import styled from '@emotion/styled';
import { Account, Project } from 'api/apollo/generated/graphql';
import { motion } from 'framer-motion';
import { Editor as EditorRoot } from 'layout/Editor';
import { ActiveEditor } from 'providers/Project';
// import {
//   PLACEHOLDER_DESCRIPTION,
//   PLACEHOLDER_TITLE,
// } from 'providers/Project/projectDefault';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useRef, useState } from 'react';
import { Flex } from 'theme-ui';

// import CadenceEditor from 'components/CadenceEditor';
// import {
//   Input,
//   InputBlock,
//   Label,
// } from 'components/Arguments/SingleArgument/styles';
// import { Markdown } from 'components/Markdown';
// import { MdeEditor } from 'components/MdeEditor';
// import {
//   ProjectDescription,
//   ProjectHeading,
//   ProjectInfoContainer,
//   ReadmeHtmlContainer,
// } from './layout-components';

import EditorPanels from 'components/Editor/EditorPanels';
import { ChildProps, SXStyles } from 'src/types';
import { decodeText } from 'util/readme';

const styles: SXStyles = {
  editorContainer: {
    gridArea: 'main',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '8px',
    flexGrow: 1,
    margin: '8px 8px 0 8px',
  },
};

export interface WithShowProps {
  show: boolean;
}

const Header = ({ children }: ChildProps) => {
  return (
    <motion.div>
      <Flex
        py={1}
        sx={{
          flex: '1 1 auto',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '1em',
          paddingRight: '1em',
        }}
      >
        {children}
      </Flex>
    </motion.div>
  );
};

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

// const MAX_DESCRIPTION_SIZE = Math.pow(1024, 2); // 1mb of storage can be saved into readme field
// const calculateSize = (readme: string) => {
//   const { size } = new Blob([readme]);
//   return size >= MAX_DESCRIPTION_SIZE;
// };

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

  // const [descriptionOverflow, setDescriptionOverflow] = useState(
  //   calculateSize(project.readme),
  // );

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

  // const setProjectProperties = (
  //   title: string,
  //   description: string,
  //   readme: string,
  // ) => {
  //   project.title = title;
  //   project.description = description;
  //   project.readme = readme;
  //   active.onChange(title, description, readme);
  // };

  // const isReadmeEditor = active.type === EntityType.Readme;

  // const readmeLabel = `README.md${
  //   descriptionOverflow ? " - Content can't be more than 1Mb in size" : ''
  // }`;

  return (
    <Flex sx={styles.editorContainer}>
      <EditorRoot>
        {/* This is Project Info Block, PRODUCT INFO (ReadMe) REMOVED FOR v2 MVP */}
        {/* <ProjectInfoContainer show={isReadmeEditor}>
          {project.parentId && !project.persist ? (
            <>
              <ProjectHeading>{title}</ProjectHeading>
              <Divider
                sx={{ marginX: '1.0rem', marginY: '1.0rem', opacity: '0.3' }}
              />
              <ProjectDescription>{description}</ProjectDescription>
              <Divider
                sx={{ marginX: '1.0rem', marginY: '2.25rem', opacity: '0.3' }}
              />
              <ReadmeHtmlContainer>
                <Markdown content={readme} />
              </ReadmeHtmlContainer>
            </>
          ) : (
            <>
              <InputBlock mb="12px">
                <Label>Title</Label>
                <Input
                  value={title}
                  placeholder={PLACEHOLDER_TITLE}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setProjectProperties(
                      event.target.value,
                      description,
                      readme,
                    );
                  }}
                />
              </InputBlock>
              <InputBlock mb="12px">
                <Label>Description</Label>
                <Input
                  value={description}
                  placeholder={PLACEHOLDER_DESCRIPTION}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setProjectProperties(title, event.target.value, readme);
                  }}
                />
              </InputBlock>
              <Label error={descriptionOverflow}>{readmeLabel} </Label>
              <MdeEditor
                value={readme}
                onChange={(readme: string) => {
                  const overflow = calculateSize(readme);
                  setDescriptionOverflow(overflow);
                  setReadme(readme);
                  if (!overflow) {
                    setProjectProperties(title, description, readme);
                  }
                }}
                overflow={descriptionOverflow}
              />
            </>
          )}
        </ProjectInfoContainer> */}
        <EditorPanels show={true} />
      </EditorRoot>
    </Flex>
  );
};

const AnimatedText = styled.div`
  position: relative;
  color: #fff;
  &:before {
    content: 'Click here to start a tutorial';
    animation: animatebg 7s infinite;
    position: absolute;
    filter: brightness(80%);
    background: linear-gradient(
      120deg,
      rgb(145, 251, 158),
      rgb(240, 125, 228),
      rgb(139, 244, 253)
    );
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    top: 0;
    left: 0;
  }
`;

export { EditorContainer, Header, AnimatedText };
