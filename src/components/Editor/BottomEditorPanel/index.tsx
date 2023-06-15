import { Tab } from '@headlessui/react';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import BottomEditorPanelHeader from './BottomEditorPanelHeader';
import RenderError from './RenderError';
import { RenderResponse } from './RenderResponse';
import theme from '../../../theme';

export const BOTTOM_EDITOR_PANEL_HEADER_HEIGHT = 80;

type BottomEditorPanelProps = {
  problemsList: any;
  selectedBottomTab: number;
  setSelectedBottomTab: (index: number) => void;
};

const styles: SXStyles = {
  root: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    paddingTop: 5,
    padding: '1px solid #DEE2E9',
  },
  tabPanels: {
    height: '100%',
    border: '1px solid #DEE2E9',
    backgroundColor: 'white',
    overflow: 'auto',
    width: '100%',
  },
  tabPanel: {
    flex: 1,
    height: '100%',
    padding: 7,
    margin: '0px 45px',
  },
};

const BottomEditorPanel = ({
  problemsList,
  selectedBottomTab,
  setSelectedBottomTab,
}: BottomEditorPanelProps) => {
  const { showBottomPanel, active } = useProject();

  /**
   * Make active key out of active project item type and index
   */
  const getActiveKey = () => `${active.type}-${active.index}`;

  const getProblems = (): any => {
    const key = getActiveKey();
    return (
      problemsList[key] || {
        error: [],
        warning: [],
        hint: [],
        info: [],
      }
    );
  };
  const panelProblems = getProblems();

  if (theme.isMobile) {
    return null;
  }

  return (
    <Flex sx={styles.root}>
      <Tab.Group
        selectedIndex={selectedBottomTab}
        onChange={setSelectedBottomTab}
      >
        <BottomEditorPanelHeader
          problems={problemsList}
          selectedBottomTab={selectedBottomTab}
          setSelectedBottomTab={setSelectedBottomTab}
        />
        {showBottomPanel && (
          <Flex as={Tab.Panels} sx={styles.tabPanels}>
            <Flex as={Tab.Panel} sx={styles.tabPanel}>
              <RenderResponse />
            </Flex>
            <Flex as={Tab.Panel} sx={styles.tabPanel}>
              <RenderError list={panelProblems} />
            </Flex>
          </Flex>
        )}
      </Tab.Group>
    </Flex>
  );
};

export default BottomEditorPanel;
