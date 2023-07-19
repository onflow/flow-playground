import { Tab } from '@headlessui/react';
import { useProject } from 'providers/Project/projectHooks';
import React, { Fragment } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { SXStyles } from 'src/types';
import { Box, Flex, useThemeUI } from 'theme-ui';
import Button from '../../Button';
import LogIcon from '../../Icons/LogIcon';
import { isMobile } from '../CadenceEditor/ControlPanel/utils';

type BottomEditorPanelHeaderProps = {
  problems: any;
  selectedBottomTab: number;
  setSelectedBottomTab: (index: number) => void;
};

const BottomEditorPanelHeader = ({
  problems,
  selectedBottomTab,
  setSelectedBottomTab,
}: BottomEditorPanelHeaderProps) => {
  const { showBottomPanel, setShowBottomPanel, toggleBottomPanel, active } =
    useProject();

  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    header: {
      borderRadius: '8px 8px 0 0',
      backgroundColor: theme.colors.primary,
      border: `1px solid ${theme.colors.outline}`,
    },
    tabButton: {
      display: 'inline-flex',
      background: 'transparent',
      borderWidth: '0px',
      paddingY: 9,
      paddingX: 10,
      marginLeft: 8,
      gap: 4,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text',
      position: 'relative',
      '&:hover': {
        opacity: 0.75,
      },
    },
    tabIndicator: {
      borderRadius: '8px 8px 0 0',
      height: '6px',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      backgroundColor: 'transparent',
    },
    tabIndicatorSelected: {
      backgroundColor: 'accent',
    },
    collapseButton: {
      color: 'text',
      px: 10,
      '&:hover': {
        opacity: 0.75,
      },
    },
  };

  const TabIndicator = ({ selected }: { selected: boolean }) => {
    const sx = selected
      ? { ...styles.tabIndicator, ...styles.tabIndicatorSelected }
      : styles.tabIndicator;

    return <Box sx={sx} />;
  };

  /**
   * Make active key out of active project item type and index
   */
  const getActiveKey = () => `${active.type}-${active.index}`;

  const getProblems = (): any => {
    const key = getActiveKey();
    return (
      problems[key] || {
        error: [],
        warning: [],
        hint: [],
        info: [],
      }
    );
  };
  const panelProblems = getProblems();

  const onTabClick = (index: number) => {
    setSelectedBottomTab(index);
    if (!showBottomPanel) {
      setShowBottomPanel(true);
    } else if (index === selectedBottomTab) {
      setShowBottomPanel(false);
    }
  };

  const statusMessage = `${panelProblems.error.length} Error${
    panelProblems.error.length === 0 || panelProblems.error.length > 1
      ? 's'
      : ''
  }`;

  if (isMobile()) {
    return null;
  }

  return (
    <Flex as={Tab.List} sx={styles.header}>
      <Flex>
        <Tab as={Fragment}>
          <Button
            sx={styles.tabButton}
            variant="unstyled"
            inline={true}
            onClick={() => onTabClick(0)}
          >
            <LogIcon />
            Log
            <TabIndicator selected={selectedBottomTab == 0} />
          </Button>
        </Tab>
        <Tab as={Fragment}>
          <Button
            sx={styles.tabButton}
            variant="unstyled"
            inline={true}
            onClick={() => onTabClick(1)}
          >
            <FaRegTimesCircle />
            <p>{statusMessage}</p>
            <TabIndicator selected={selectedBottomTab == 1} />
          </Button>
        </Tab>
        {
          // temporarily disabling history tab. need more info if this is going to get perm del.
          /*<Tab as={Fragment}>
          <Button
            sx={styles.tabButton}
            variant="unstyled"
            inline={true}
            onClick={() => onTabClick(1)}
          >
            <HistoryIcon /> History
            <TabIndicator selected={isHistorySelected} />
          </Button>
        </Tab>*/
        }
      </Flex>
      <Flex ml="auto">
        <Button
          sx={styles.collapseButton}
          variant="unstyled"
          inline={true}
          onClick={toggleBottomPanel}
        >
          {showBottomPanel ? (
            <GoChevronDown size="20px" />
          ) : (
            <GoChevronUp size="20px" />
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default BottomEditorPanelHeader;
