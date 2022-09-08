import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaShareSquare } from 'react-icons/fa';
import useClipboard from 'react-use-clipboard';
import { Box, Button, Divider, Flex } from 'theme-ui';

import { Account, Project } from 'api/apollo/generated/graphql';
import { Editor as EditorRoot } from 'layout/Editor';
import { Heading } from 'layout/Heading';
import { Main as MainRoot } from 'layout/Main';
import { ActiveEditor, EntityType } from 'providers/Project';
import {
  PLACEHOLDER_DESCRIPTION,
  PLACEHOLDER_TITLE,
} from 'providers/Project/projectDefault';
import { useProject } from 'providers/Project/projectHooks';

import Mixpanel from 'util/mixpanel';

import { default as FlowButton } from 'components/Button';
// import CadenceEditor from 'components/CadenceEditor';
import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';
import { Version } from 'components/CadenceVersion';
import DeploymentBottomBar from 'components/DeploymentBottomBar';
import { Markdown } from 'components/Markdown';
import { MdeEditor } from 'components/MdeEditor';
import ResourcesBar from 'components/ResourcesBar';
import ScriptBottomBar from 'components/ScriptBottomBar';
import TransactionBottomBar from 'components/TransactionBottomBar';
import {
  ProjectDescription,
  ProjectHeading,
  ProjectInfoContainer,
  ReadmeHtmlContainer,
} from './layout-components';

import CadenceEditor from 'components/CadenceEditor';
import { decodeText } from 'util/readme';

export interface WithShowProps {
  show: boolean;
}

const Header: React.FC = ({ children }) => {
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

const NavButton: React.FC = ({ children }) => {
  return (
    <Button
      variant="secondary"
      sx={{
        marginLeft: '0.25rem',
        textDecoration: 'none',
      }}
    >
      {children}
    </Button>
  );
};

const Nav: React.FC = ({ children }) => {
  return <Flex>{children}</Flex>;
};

const ShareButton: React.FC<{ url: string }> = ({ url }) => {
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });
  return (
    <Flex
      sx={{
        alignItems: 'center',
      }}
    >
      <FlowButton
        onClick={() => {
          setCopied();
          Mixpanel.track('Share link copied', { url });
        }}
        Icon={FaShareSquare}
      >
        {!isCopied ? 'Share' : 'Link Copied!'}
      </FlowButton>
    </Flex>
  );
};

const ShareSaveButton: React.FC<{
  url: string;
  saveText: string;
  showShare: boolean;
  onSave: () => void;
  icon: any;
}> = ({ url, saveText, showShare, onSave, icon }) => {
  const { isSavingCode } = useProject();
  return (
    <Box sx={{ marginRight: '0.5rem' }}>
      {showShare ? (
        <ShareButton url={url} />
      ) : (
        <FlowButton
          onClick={() => onSave()}
          disabled={isSavingCode}
          Icon={icon}
        >
          {saveText}
        </FlowButton>
      )}
    </Box>
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
    if (prev[i].deployedCode !== current[i].deployedCode) {
      return false;
    }
  }
  return true;
};

const MAX_DESCRIPTION_SIZE = Math.pow(1024, 2); // 1mb of storage can be saved into readme field
const calculateSize = (readme: string) => {
  const { size } = new Blob([readme]);
  return size >= MAX_DESCRIPTION_SIZE;
};

const EditorContainer: React.FC<EditorContainerProps> = ({
  isLoading,
  project,
  active,
}) => {
  const [title, setTitle] = useState<string | undefined>(
    decodeText(project.title),
  );
  const [description, setDescription] = useState<string | undefined>(
    decodeText(project.description),
  );
  const [readme, setReadme] = useState<string | undefined>(project.readme);

  const projectAccess = useProject();

  const [descriptionOverflow, setDescriptionOverflow] = useState(
    calculateSize(project.readme),
  );

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

  const updateProject = (
    title: string,
    description: string,
    readme: string,
  ) => {
    project.title = title;
    project.description = description;
    project.readme = readme;
    active.onChange(title, description, readme);
  };

  const isReadmeEditor = active.type === 4;
  const readmeLabel = `README.md${
    descriptionOverflow ? " - Content can't be more than 1Mb in size" : ''
  }`;

  return (
    <MainRoot>
      <EditorRoot>
        <EditorTitle type={active.type} />
        {/* This is Project Info Block */}
        <ProjectInfoContainer show={isReadmeEditor}>
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
                    updateProject(event.target.value, description, readme);
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
                    updateProject(title, event.target.value, readme);
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
                    updateProject(title, description, readme);
                  }
                }}
                overflow={descriptionOverflow}
              />
            </>
          )}
        </ProjectInfoContainer>
        {/* This is Cadence Editor */}
        {/*        <CadenceEditor
          type={active.type}
          activeId={activeId}
          code={code}
          mount="cadenceEditor"
          onChange={(code: string, _: any) => onEditorChange(code)}
          show={!isReadmeEditor}
        />*/}
        <CadenceEditor show={!isReadmeEditor} />
      </EditorRoot>
      <BottomBarContainer active={active} />
    </MainRoot>
  );
};

type EditorTitleProps = {
  type: EntityType;
};

const EditorTitle: React.FC<EditorTitleProps> = ({ type }) => {
  return (
    <Heading>
      {type === EntityType.Account && 'Contract'}
      {type === EntityType.TransactionTemplate && 'Transaction Template'}
      {type === EntityType.ScriptTemplate && 'Script Template'}
      {type === EntityType.Readme && 'Project Details'}

      {type !== EntityType.Readme && <Version />}
    </Heading>
  );
};

type BottomBarContainerProps = {
  active: ActiveEditor;
};

const BottomBarContainer: React.FC<BottomBarContainerProps> = ({ active }) => {
  const [bottomBarHeight, setBottomBarHeight] = useState(140);
  switch (active.type) {
    case EntityType.Account:
      return (
        <>
          <ResourcesBar resultHeight={bottomBarHeight} />
          <DeploymentBottomBar setBottomBarHeight={setBottomBarHeight} />
        </>
      );
    case EntityType.TransactionTemplate:
      return (
        <>
          <ResourcesBar resultHeight={bottomBarHeight} />
          <TransactionBottomBar setBottomBarHeight={setBottomBarHeight} />
        </>
      );
    case EntityType.ScriptTemplate:
      return (
        <>
          <ResourcesBar resultHeight={bottomBarHeight} />
          <ScriptBottomBar setBottomBarHeight={setBottomBarHeight} />
        </>
      );
    default:
      return null;
  }
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

export {
  EditorContainer,
  Header,
  NavButton,
  Nav,
  ShareSaveButton,
  AnimatedText,
};
