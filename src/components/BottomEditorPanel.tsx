import { Tab } from '@headlessui/react';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import BottomEditorPanelHeader from './BottomEditorPanelHeader';
import { RenderResponse } from './RenderResponse';

export const BOTTOM_EDITOR_PANEL_HEADER_HEIGHT = 80;

type BottomEditorPanelProps = {
  selectedBottomTab: number;
  setSelectedBottomTab: (index: number) => void;
};

const styles: SXStyles = {
  root: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingTop: 5,
  },
  tabPanels: {
    height: '100%',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'borderColor',
    backgroundColor: 'white',
    overflow: 'auto',
  },
  tabPanel: {
    flex: 1,
    height: '100%',
    padding: 7,
  },
};

const BottomEditorPanel = ({
  selectedBottomTab,
  setSelectedBottomTab,
}: BottomEditorPanelProps) => {
  const { showBottomPanel } = useProject();

  return (
    <Flex sx={styles.root}>
      <Tab.Group
        selectedIndex={selectedBottomTab}
        onChange={setSelectedBottomTab}
      >
        <BottomEditorPanelHeader
          selectedBottomTab={selectedBottomTab}
          setSelectedBottomTab={setSelectedBottomTab}
        />
        {showBottomPanel && (
          <Flex as={Tab.Panels} sx={styles.tabPanels}>
            <Flex as={Tab.Panel} sx={styles.tabPanel}>
              <RenderResponse />
            </Flex>
            <Tab.Panel>History</Tab.Panel>
          </Flex>
        )}
      </Tab.Group>
    </Flex>
  );
};

export default BottomEditorPanel;
