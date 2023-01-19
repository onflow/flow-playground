import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import theme from '../../theme';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { storageMapByIndex } from 'util/accounts';
import BottomEditorPanel from './BottomEditorPanel';
import BottomEditorPanelHeader from './BottomEditorPanel/BottomEditorPanelHeader';
import Button from '../Button';
import CadenceEditor from './CadenceEditor';
import CopyIcon from '../Icons/CopyIcon';
import ExplorerTransactionIcon from '../Icons/ExplorerTransactionIcon';
import ExplorerScriptIcon from '../Icons/ExplorerScriptIcon';
import ExplorerContractIcon from '../Icons/ExplorerContractIcon';
import useClipboard from 'react-use-clipboard';
import { FaClipboardCheck } from 'react-icons/fa';

export const BOTTOM_EDITOR_PANEL_HEADER_HEIGHT = 70;
const BOTTOM_EDITOR_HEIGHT = 200;
const EDITOR_HEADER_HEIGHT = 60;

type EditorPanelsProps = {
  show: boolean;
};

const styles: SXStyles = {
  root: {
    '--sash-size': '14px',
    '--focus-border': 'borderColor',
    '--separator-border': 'transparent',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  editor: {
    height: '100%',
    borderBottom: `solid 1px #DEE2E9`,
    borderRight: `solid 1px #DEE2E9`,
    borderLeft: `solid 1px #DEE2E9`,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    padding: '12px 28px',
    border: `solid 1px #DEE2E9`,
    borderRadius: '0px',
    backgroundColor: theme.colors.white,
  },
  copyButton: {
    width: '32px',
    height: '32px',
    padding: '0px',
    backgroundColor: theme.colors.white,
  },
  editorTitle: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'inherit',
    justifyContent: 'start',
    margin: '0',
    padding: '0px 8px',
    background: '#EAEAFA',
    borderRadius: '8px',
    color: '#3031D1',
  },
  icon: {
    paddingRight: '4px',
    filter:
      'brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(3637%) hue-rotate(242deg) brightness(95%) contrast(100%)',
  },
};

const EditorPanels = ({ show }: EditorPanelsProps) => {
  const { project, active, showBottomPanel } = useProject();
  const [selectedBottomTab, setSelectedBottomTab] = useState(0);
  const [problemsList, setProblemsList] = useState<any>({});

  let fileName, script;
  switch (active.type) {
    case EntityType.ContractTemplate:
      fileName = `${project.contractTemplates[active.index].title}.cdc`;
      script = project.contractTemplates[active.index].script;
      break;
    case EntityType.TransactionTemplate:
      fileName = `${project.transactionTemplates[active.index].title}.cdc`;
      script = project.transactionTemplates[active.index].script;
      break;
    case EntityType.ScriptTemplate:
      fileName = `${project.scriptTemplates[active.index].title}.cdc`;
      script = project.scriptTemplates[active.index].script;
      break;
    default:
      const accountNumber = storageMapByIndex(active.index);
      fileName =
        accountNumber == '0x01'
          ? `${accountNumber}-Default`
          : `${accountNumber}`;
      script = project.accounts[active.index].state;
  }

  const [isCopied, setCopied] = useClipboard(script, {
    successDuration: 1000,
  });

  const getIcon = () => {
    switch (active.type) {
      case EntityType.TransactionTemplate:
        return <ExplorerTransactionIcon />;
      case EntityType.ScriptTemplate:
        return <ExplorerScriptIcon />;
      case EntityType.ContractTemplate:
        return <ExplorerContractIcon />;
      default:
        return null;
    }
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.editor}>
        <Allotment vertical={true}>
          <Allotment.Pane minSize={EDITOR_HEADER_HEIGHT}>
            <Flex sx={styles.editorHeader}>
              <Flex sx={styles.editorTitle}>
                <Box sx={styles.icon}>{getIcon()}</Box>
                {fileName}
              </Flex>

              <Button
                sx={styles.copyButton}
                variant="explorer"
                onClick={setCopied}
              >
                {isCopied ? <FaClipboardCheck /> : <CopyIcon />}
              </Button>
            </Flex>
          </Allotment.Pane>
          <Allotment.Pane minSize={100} preferredSize="100%">
            <CadenceEditor
              problemsList={problemsList}
              setProblemsList={setProblemsList}
              show={show}
            />
          </Allotment.Pane>
          <Allotment.Pane
            minSize={BOTTOM_EDITOR_PANEL_HEADER_HEIGHT + BOTTOM_EDITOR_HEIGHT}
            visible={showBottomPanel}
          >
            <BottomEditorPanel
              problemsList={problemsList}
              selectedBottomTab={selectedBottomTab}
              setSelectedBottomTab={setSelectedBottomTab}
            />
          </Allotment.Pane>
        </Allotment>
      </Flex>
      {!showBottomPanel && (
        <Box
          style={{
            height: BOTTOM_EDITOR_PANEL_HEADER_HEIGHT,
            paddingTop: 10,
            width: '100%',
          }}
        >
          <Tab.Group
            selectedIndex={selectedBottomTab}
            onChange={setSelectedBottomTab}
          >
            <BottomEditorPanelHeader
              problems={problemsList}
              selectedBottomTab={selectedBottomTab}
              setSelectedBottomTab={setSelectedBottomTab}
            />
          </Tab.Group>
        </Box>
      )}
    </Flex>
  );
};

export default EditorPanels;
