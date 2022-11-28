import React from 'react';
import { ChildProps, SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';

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

  return (
    <Flex sx={styles.root}>
      <Box sx={styles.headerTitle}>{title}</Box>
      {children}
    </Flex>
  );
};

export default LeftSidebarSection;
