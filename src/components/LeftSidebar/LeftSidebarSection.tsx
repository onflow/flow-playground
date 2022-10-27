import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ChildProps, SXStyles } from 'src/types';
import { Box, Button, Flex } from 'theme-ui';

interface Props extends ChildProps {
  title: string;
}

const styles: SXStyles = {
  root: {
    flexDirection: 'column',
  },
  headerButton: {
    alignItems: 'center',
    textTransform: 'uppercase',
    color: 'leftSidebarHeaderText',
    fontWeight: 700,
    fontSize: 1,
    marginBottom: 8,
    display: 'inline-flex',
    alignSelf: 'flex-start',
    '&:hover': {
      opacity: 0.75,
    },
  },
  headerTitle: {
    mr: 4,
  },
};

const LeftSidebarSection = ({ title, children }: Props) => {
  const [showContent, setShowContent] = useState(true);
  const onToggle = () => setShowContent((prev) => !prev);

  return (
    <Flex sx={styles.root}>
      <Button
        type="button"
        onClick={onToggle}
        sx={styles.headerButton}
        variant="unstyled"
        title={`Toggle ${title}`}
      >
        <Box sx={styles.headerTitle}>{title}</Box>
        {showContent ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </Button>
      {showContent && children}
    </Flex>
  );
};

export default LeftSidebarSection;
