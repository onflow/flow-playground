import React, { useState, useEffect, useRef } from 'react';
import { Flex, Button, Box, Divider } from 'theme-ui';
import styled from '@emotion/styled';
import { FaShareSquare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useClipboard from 'react-use-clipboard';

import { Main as MainRoot } from 'layout/Main';
import { Editor as EditorRoot } from 'layout/Editor';
import { Heading } from 'layout/Heading';
import { EntityType, ActiveEditor } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { PLACEHOLDER_DESCRIPTION, PLACEHOLDER_TITLE } from "providers/Project/projectDefault";
import {Account, Project} from 'api/apollo/generated/graphql';


import debounce from 'util/debounce';
import Mixpanel from 'util/mixpanel';

import { default as FlowButton } from 'components/Button';
import CadenceEditor from 'components/CadenceEditor';
import TransactionBottomBar from 'components/TransactionBottomBar';
import ScriptBottomBar from 'components/ScriptBottomBar';
import { Version } from 'components/CadenceVersion';
import DeploymentBottomBar from 'components/DeploymentBottomBar';
import ResourcesBar from 'components/ResourcesBar';
import { MdeEditor } from 'components/MdeEditor';
import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';
import { Markdown } from 'components/Markdown';

import { decodeText } from "util/readme";
import { CadenceLanguageServer, Callbacks } from "util/language-server";
import { MonacoServices } from "monaco-languageclient/lib/monaco-services";
import * as monaco from "monaco-editor";

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

function getActiveCode(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].draftCode;
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].script
        : '';
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].script
        : '';
    default:
      return '';
  }
}

function getActiveId(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      return project.accounts[active.index].id;
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].id
        : '';
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].id
        : '';
    default:
      return '';
  }
}

const ProjectInfoContainer = styled.div<WithShowProps>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  margin: 0.2rem 1rem 0rem 1rem;
  min-width: 500px;
  margin-top: 1rem;
`;

const ProjectHeading = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.25rem;
  padding: 1rem;
`;

const ProjectDescription = styled.div`
  font-size: 1.2rem;
  margin: 1rem;
  margin-top: 2rem;
  padding: 0.5rem;
  border-radius: 2px;
  font-style: italic;
`;

const ReadmeHtmlContainer = styled.div`
  margin: 1rem;
  margin-top: 0rem;
`;

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  },[value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

// This method
const compareContracts = (prev: Account[], current: Account[]) => {
  for (let i = 0; i < prev.length; i++) {
    if (prev[i].deployedCode !== current[i].deployedCode){
      return false
    }
  }
  return true
}

let monacoServicesInstalled = false;

const MAX_DESCRIPTION_SIZE = Math.pow(1024, 2) // 1mb of storage can be saved into readme field
const calculateSize = (readme: string) => {
  const { size } = new Blob([readme])
  return size >= MAX_DESCRIPTION_SIZE
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  isLoading,
  project,
  active,
}) => {
  const [title, setTitle] = useState<string | undefined>(
      decodeText(project.title)
  );
  const [description, setDescription] = useState<string | undefined>(
      decodeText(project.description)
  );
  const [readme, setReadme] = useState<string | undefined>(project.readme);

  const [code, setCode] = useState('');
  const [activeId, setActiveId] = useState(null);

  const projectAccess = useProject()

  const [descriptionOverflow, setDescriptionOverflow] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setCode('');
      setTitle('');
      setDescription('');
      setActiveId(null);
    } else {
      setCode(getActiveCode(project, active));
      setTitle(title);
      setDescription(description);
      setReadme(readme);
      setActiveId(getActiveId(project, active));
    }
  }, [isLoading, active, projectAccess.project]);


  // The Monaco Language Client services have to be installed globally, once.
  // An editor must be passed, which is only used for commands.
  // As the Cadence language server is not providing any commands this is OK

  if (!monacoServicesInstalled) {
    monacoServicesInstalled = true;
    MonacoServices.install(monaco);
  }

  // We will move callbacks out
  let callbacks : Callbacks = {
    // The actual callback will be set as soon as the language server is initialized
    toServer: null,

    // The actual callback will be set as soon as the language server is initialized
    onClientClose: null,

    // The actual callback will be set as soon as the language client is initialized
    onServerClose: null,

    // The actual callback will be set as soon as the language client is initialized
    toClient: null,

    //@ts-ignore
    getAddressCode(address: string): string | undefined {
      // we will set it once it is instantiated
    }
  };

  const getCode = (project: any) => (address: string) =>{
      const number = parseInt(address, 16);
      if (!number) {
        return;
      }

      const index = number - 1
      if (index < 0 || index >= project.accounts.length) {
        return;
      }
      let code = project.accounts[index].deployedCode;
      return code
  }

  const [serverReady, setServerReady] = useState(false)
  const [serverCallbacks, setServerCallbacks] = useState(callbacks)
  const [languageServer, setLanguageServer] = useState(null)
  const initLanguageServer = async ()=>{
    const server = await CadenceLanguageServer.create(callbacks)
    setLanguageServer(server)
  }

  useEffect(()=>{
    // Init language server
    initLanguageServer()

    let checkInterval = setInterval(()=>{
      // .toServer() method is populated by language server
      // if it was not properly started or in progress it will be "null"
      if (callbacks.toServer !== null){
        clearInterval(checkInterval);
        setServerReady(true)
        callbacks.getAddressCode = getCode(project)
        setServerCallbacks(callbacks)
      }
    }, 300)
    // TODO: Check if we can reinstantiate language server after accounts has been changed
  },[])

  const reloadServer = async ()=>{
    serverCallbacks.getAddressCode = getCode(project)
    const server = await CadenceLanguageServer.create(serverCallbacks)
    setServerCallbacks(serverCallbacks)
    setLanguageServer(server)
  }

  const previousProjectState = usePrevious(project)

  // This hook will listen for project updates and if one of the contracts has been changed,
  // it will reload language server
  useEffect(()=>{
    if (previousProjectState !== undefined){
      // @ts-ignore
      const previousAccounts = previousProjectState.accounts || []
      const equal = compareContracts(previousAccounts, project.accounts)
      if (!equal){
        reloadServer()
      }
    }
  }, [project])

  const onEditorChange = debounce(active.onChange);
  const updateProject = (
    title: string,
    description: string,
    readme: string,
  ) => {
    project.title = title;
    project.description = description;
    project.readme = readme;
    onEditorChange(title, description, readme);
  };

  const isReadmeEditor = active.type === 4;
  console.log({descriptionOverflow})
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
                <Markdown content={readme}></Markdown>
              </ReadmeHtmlContainer>
            </>
          ) : (
            <>
              <InputBlock mb={'12px'}>
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
              <InputBlock mb={'12px'}>
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
              <Label>README.md</Label>
              <MdeEditor
                value={readme}
                onChange={(readme: string) => {
                  const overflow = calculateSize(readme)
                  setDescriptionOverflow(overflow)
                  if(!overflow){
                    setReadme(readme);
                    updateProject(title, description, readme);
                  }
                }}
              />
            </>
          )}
        </ProjectInfoContainer>
        {/* This is Cadence Editor */}
        <CadenceEditor
          type={active.type}
          activeId={activeId}
          code={code}
          mount="cadenceEditor"
          onChange={(code: string, _: any) => onEditorChange(code)}
          show={!isReadmeEditor}
          languageServer={languageServer}
          callbacks={serverCallbacks}
          serverReady={serverReady}
        />
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
