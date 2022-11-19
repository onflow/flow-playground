import { Tab } from '@headlessui/react';
import { useProject } from 'providers/Project/projectHooks';
import React, { Fragment } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import Button from './Button';
import HistoryIcon from './Icons/HistoryIcon';
import LogIcon from './Icons/LogIcon';

type BottomEditorPanelHeaderProps = {
  selectedBottomTab: number;
  setSelectedBottomTab: (index: number) => void;
};

const styles: SXStyles = {
  header: {
    borderRadius: '8px 8px 0 0',
    backgroundColor: 'white',
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
    backgroundColor: 'actionBlue',
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

const BottomEditorPanelHeader = ({
  selectedBottomTab,
  setSelectedBottomTab,
}: BottomEditorPanelHeaderProps) => {
  const { showBottomPanel, setShowBottomPanel, toggleBottomPanel } =
    useProject();

  const onTabClick = (index: number) => {
    setSelectedBottomTab(index);
    if (!showBottomPanel) {
      setShowBottomPanel(true);
    } else if (index === selectedBottomTab) {
      setShowBottomPanel(false);
    }
  };

  const isLogSelected = selectedBottomTab === 0;
  const isHistorySelected = selectedBottomTab === 1;

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
            <TabIndicator selected={isLogSelected} />
          </Button>
        </Tab>
        <Tab as={Fragment}>
          <Button
            sx={styles.tabButton}
            variant="unstyled"
            inline={true}
            onClick={() => onTabClick(1)}
          >
            <HistoryIcon /> History
            <TabIndicator selected={isHistorySelected} />
          </Button>
        </Tab>
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
