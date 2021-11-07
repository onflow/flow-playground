import React, { useState, useEffect } from "react";
import { Flex, Button, Box } from "theme-ui";
import styled from "@emotion/styled";
import { FaShareSquare } from "react-icons/fa";
import { motion } from "framer-motion";
import useClipboard from "react-use-clipboard";

import { Main as MainRoot } from "layout/Main";
import { Editor as EditorRoot } from "layout/Editor";
import { Heading } from "layout/Heading";
import { HeadingContainer } from "layout/HeadingContainer";
import { EntityType, ActiveEditor } from "providers/Project";
import { useProject } from "providers/Project/projectHooks";
import { Project } from "api/apollo/generated/graphql";

import debounce from "../../util/debounce";
import Mixpanel from "../../util/mixpanel";

import { default as FlowButton } from "components/Button";
import CadenceEditor from "components/CadenceEditor";
import AccountBottomBar from "components/AccountBottomBar";
import TransactionBottomBar from "components/TransactionBottomBar";
import ScriptBottomBar from "components/ScriptBottomBar";
import { Version } from "components/CadenceVersion";

import ContractList from "components/ContractList";
import { navigate } from "@reach/router";
import { isUUUID } from "../../util/url";

const Header: React.FC = ({ children }) => {
  return (
    <motion.div>
      <Flex
        py={1}
        sx={{
          flex: "1 1 auto",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1em",
          paddingRight: "1em"
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
        marginLeft: "0.25rem",
        textDecoration: "none"
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
        alignItems: "center"
      }}
    >
      <FlowButton
        onClick={() => {
          setCopied();
          Mixpanel.track("Share link copied", { url });
        }}
        Icon={FaShareSquare}
      >
        {!isCopied ? "Share" : "Link Copied!"}
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
    <Box sx={{ marginRight: "0.5rem" }}>
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
  //soe logging type,index,contractIndex inside getActiveCode
  console.log(`type,index,contractIndex: ${active.type},${active.index},${active.contractIndex}`);
  switch (active.type) {
    case EntityType.Account:
      //return project.accounts[active.index].draftCode;
      //soe now needs to get Account's active contract's script
      return project.contracts[active.contractIndex]
        ? project.contracts[active.contractIndex].script 
        : "";
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].script
        : "";
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].script
        : "";
    default:
      return "";
  }
}

function getActiveId(project: Project, active: ActiveEditor): string {
  switch (active.type) {
    case EntityType.Account:
      //return project.accounts[active.index].id;
      //soe get id of active contract
      return project.contracts[active.contractIndex]
        ? project.contracts[active.contractIndex].id
        : "";
    /*case EntityType.Contract:
      return project.contracts[active.index].id;*/
    case EntityType.TransactionTemplate:
      return project.transactionTemplates[active.index]
        ? project.transactionTemplates[active.index].id
        : "";
    case EntityType.ScriptTemplate:
      return project.scriptTemplates[active.index]
        ? project.scriptTemplates[active.index].id
        : "";
    default:
      return "";
  }
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  isLoading,
  project,
  active
}) => {
  const [code, setCode] = useState("");
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (isLoading) {
      setCode("");
      setActiveId(null);
    } else {
      setCode(getActiveCode(project, active));
      setActiveId(getActiveId(project, active));
    }
  }, [isLoading, active, project]);

  const onCodeChange = debounce(active.onChange);

  function getCode(index: number): string | undefined {
      if (index < 0 || index >= project.accounts.length) {
        return
      }
      return project.accounts[index].draftCode
    }

  return (
    <MainRoot>
      <EditorTitle type={active.type} />
      <EditorRoot>
        <CadenceEditor
          type={active.type}
          activeId={activeId}
          code={code}
          mount="cadenceEditor"
          onChange={(code: string, _: any) => onCodeChange(code)}
          getCode={getCode}
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

  const {
    active,
    project,
    mutator,
    deleteContract,
  } = useProject();

  const projectPath = isUUUID(project.id) ? project.id : "local";

  return (
    <HeadingContainer>
      <Heading>
        {type === EntityType.Account && "Contracts"}
        {type === EntityType.TransactionTemplate && "Transaction Template"}
        {type === EntityType.ScriptTemplate && "Script Template"}

        <Version/>
      </Heading>
      {type === EntityType.Account && <ContractList
          title="Contracts"

          //soe          
          items={
            project.contracts.filter(item => item.index === active.index)
          }
          active={
            active.type == EntityType.Account ? active.index : null
          }
          onSelect={(_, id) => {
            navigate(`/${projectPath}?type=account&id=${project.accounts[active.index].id}&contractId=${id}`)
          }}
          onUpdate={(_: any) => {}}
          onDelete={async (templateId: string) => {
            //soe delete contract and redirect to the account
            await deleteContract(templateId);
            navigate(`/${projectPath}?type=account&id=${project.accounts[active.index].id}`)
          }}
          onInsert={async () => {
            console.log(`createContract with index: ${active.index}`);
            const res = await mutator.createContract(active.index, `// draft contract`, `[DRAFT_CONTRACT]`)
            navigate(`/${projectPath}?type=account&id=${project.accounts[active.index].id}&contractId=${res.data?.createContract?.id}`)
          }}
      />}
    </HeadingContainer>
    
  );
};

type BottomBarContainerProps = {
  active: ActiveEditor;
};

const BottomBarContainer: React.FC<BottomBarContainerProps> = ({ active }) => {
  switch (active.type) {
    case EntityType.Account:
      return <AccountBottomBar />;
    case EntityType.TransactionTemplate:
      return <TransactionBottomBar />;
    case EntityType.ScriptTemplate:
      return <ScriptBottomBar />;
    default:
      return null;
  }
};

const AnimatedText = styled.div`
  position: relative;
  color: #fff;
  &:before {
    content: "Click here to start a tutorial";
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
  AnimatedText
};
