import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex, useThemeUI } from 'theme-ui';
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

const EditorPanels = ({ show }: EditorPanelsProps) => {
  const { project, active, showBottomPanel } = useProject();
  const [selectedBottomTab, setSelectedBottomTab] = useState(0);
  const [problemsList, setProblemsList] = useState<any>({});
  const accountNumber = storageMapByIndex(active.index);
  // clear problems when new project is loaded
  useEffect(() => setProblemsList({}), [project?.id]);

  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    root: {
      '--sash-size': '14px',
      '--focus-border': 'borderColor',
      '--separator-border': 'transparent',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      borderRadius: '8px',
    },
    editor: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    editorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '12px 28px',
      backgroundColor: theme.colors.primary,
      border: `solid 1px ${theme.colors.outline}`,
      borderRadius: '8px',
    },
    copyButton: {
      borderRadius: '8px',
      width: '32px',
      height: '32px',
      padding: '0px',
      display: ['none', 'flex', 'flex'], // hide on mobile
    },
    editorTitle: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'IBM Plex Mono',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      justifyContent: 'start',
      margin: '0',
      padding: '0px 8px',
      background: `${theme.colors.accent}`,
      borderRadius: '8px',
      color: `${theme.colors.active}`,
    },
    titleText: {
      minWidth: '125px',
      paddingLeft: '4px',
    },
    icon: {
      paddingRight: '4px',
      paddingLeft: '8px',
    },
  };

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
      fileName =
        accountNumber == '0x05'
          ? `${accountNumber}-Default`
          : `${accountNumber}`;
      script =
        active.index !== -1 ? project.accounts[active.index].state : '{}';
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
          <Allotment.Pane
            maxSize={EDITOR_HEADER_HEIGHT}
            minSize={EDITOR_HEADER_HEIGHT}
          >
            <Flex sx={styles.editorHeader}>
              <Flex sx={styles.editorTitle}>
                <Box sx={styles.icon}>{getIcon()}</Box>
                <Box sx={styles.titleText}>{fileName}</Box>
              </Flex>

              <Button
                sx={styles.copyButton}
                variant="secondary"
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
              setSelectedBottomTab={setSelectedBottomTab}
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
            paddingTop: '10px',
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
