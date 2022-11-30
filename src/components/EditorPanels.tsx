import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import theme from '../theme';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { storageMap } from 'util/accounts';
import BottomEditorPanel from './BottomEditorPanel';
import BottomEditorPanelHeader from './BottomEditorPanelHeader';
import Button from './Button';
import CadenceEditor from './CadenceEditor';
import CopyIcon from './Icons/CopyIcon';
import ExplorerTransactionIcon from './Icons/ExplorerTransactionIcon';
import ExplorerScriptIcon from './Icons/ExplorerScriptIcon';
import ExplorerContractIcon from './Icons/ExplorerContractIcon';
import useClipboard from 'react-use-clipboard';
import { FaClipboardCheck } from 'react-icons/fa';

export const BOTTOM_EDITOR_PANEL_HEADER_HEIGHT = 70;
const EDITOR_HEADER_HEIGHT = 70;

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
    borderRadius: '8px',
    height: '100%',
    border: '2px solid rgba(48, 49, 209, 0.1)',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '24px 28px',
  },
  copyButton: {
    width: '32px',
    height: '32px',
    padding: '0px',
    backgroundColor: theme.colors.alternateButtonBackground,
  },
  editorTitle: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'inherit',
    justifyContent: 'start',
    marginLeft: '16px',
    padding: '0px 8px',
    background: '#EAEAFA',
    borderRadius: '8px',
    color: '#3031D1',
  },
  icon: {
    paddingRight: '4px',
    filter:
      'brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(3637%) hue-rotate(242deg) brightness(95%) contrast(100%)',
  }
};

const EditorPanels = ({ show }: EditorPanelsProps) => {
  const { project, active, showBottomPanel } = useProject();
  const [selectedBottomTab, setSelectedBottomTab] = useState(0);

  let fileName, script;
  switch (active.type) {
    case EntityType.ContractTemplate:
      fileName = `${project.contractTemplates[active.index].title}.cdc`;
      script = project.contractTemplates[active.index].script;
      break;
    case EntityType.TransactionTemplate:
      fileName = `${project.transactionTemplates[active.index].title}.cdc`;
      script = project.contractTemplates[active.index].script;
      break;
    case EntityType.ScriptTemplate:
      fileName = `${project.scriptTemplates[active.index].title}.cdc`;
      script = project.contractTemplates[active.index].script;
      break;
    default:
      const accountNumber = Object.keys(storageMap).find(
        (key) => storageMap[key] == active.index,
      );
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
            <CadenceEditor show={show} />
          </Allotment.Pane>
          <Allotment.Pane
            minSize={BOTTOM_EDITOR_PANEL_HEADER_HEIGHT + 70}
            visible={showBottomPanel}
          >
            <BottomEditorPanel
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
          }}
        >
          <Tab.Group
            selectedIndex={selectedBottomTab}
            onChange={setSelectedBottomTab}
          >
            <BottomEditorPanelHeader
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
