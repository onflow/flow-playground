import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ChildProps, SXStyles } from 'src/types';
import { Flex } from 'theme-ui';

interface Props extends ChildProps {
  title: string;
}

const styles: SXStyles = {
  root: {
    flexDirection: 'column',
  },
  header: {
    alignItems: 'center',
    textTransform: 'uppercase',
    color: 'leftSidebarHeaderText',
    fontWeight: 700,
    fontSize: 1,
  },
};

const LeftSidebarSection = ({ title, children }: Props) => {
  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.header}>
        <FaChevronDown size={12} />
        {title}
      </Flex>
      {children}
    </Flex>
  );
};

export default LeftSidebarSection;
