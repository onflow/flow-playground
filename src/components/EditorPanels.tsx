import { Tab } from '@headlessui/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import BottomEditorPanel from './BottomEditorPanel';
import BottomEditorPanelHeader from './BottomEditorPanelHeader';
import CadenceEditor from './CadenceEditor';
export const BOTTOM_EDITOR_PANEL_HEADER_HEIGHT = 70;

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
    border: '2px solid rgba(48, 49, 209, 0.1)'
  }
};

const EditorPanels = ({ show }: EditorPanelsProps) => {
  const { showBottomPanel } = useProject();
  const [selectedBottomTab, setSelectedBottomTab] = useState(0);

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.editor}>
        <Allotment vertical={true}>
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
