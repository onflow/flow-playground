import React from 'react';
import { GoChevronRight } from 'react-icons/go';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { Line as LineType, Tag } from 'util/normalize-interaction-response';

const PS1 = (tag: Tag) => {
  switch (tag) {
    case Tag.EVENT:
      return 'Event';
    case Tag.ERROR:
      return 'Error';
    case Tag.VALUE:
      return 'Result';
    case Tag.UNKNOWN:
      return 'Unknown';
    case Tag.LOG:
      return '';
    default:
      return '';
  }
};

const styles: SXStyles = {
  root: {
    fontFamily: 'monospace',
    fontSize: 0,
    padding: 4,
    alignItems: 'center',
    gap: 6,
  },
  index: {
    color: 'text',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
  timestamp: {
    opacity: 0.4,
  },
  objectValue: {
    borderRadius: '3px',
    padding: 8,
    background: 'muted',
    color: 'background',
  },
};

const getColor = (tag: Tag) => {
  switch (tag) {
    case Tag.ERROR:
      return 'error';
    case Tag.VALUE:
      return 'secondary';
    case Tag.UNKNOWN:
      return 'error';
    default:
      return '';
  }
};

type LineProps = LineType & { index: number };
export const Line = ({ timestamp, tag, value, label, index }: LineProps) => {
  const ps1Content = PS1(tag);
  return (
    <Flex sx={styles.root}>
      <Box sx={styles.timestamp} as="span">
        {timestamp}
      </Box>
      {label && <span>{label}</span>}
      <GoChevronRight size="15px" />
      <Box sx={styles.index}>[{index + 1}]</Box>
      {!!ps1Content && (
        <Box sx={{ ...styles.label, color: getColor(tag) }}>{ps1Content}</Box>
      )}
      <GoChevronRight size="15px" />
      {typeof value === 'string' ? (
        <Box as="pre" sx={{ color: tag === Tag.ERROR ? 'error' : 'secondary' }}>
          {value}
        </Box>
      ) : (
        <Box sx={styles.objectValue} as="pre">
          {JSON.stringify(value, null, 2)}
        </Box>
      )}
    </Flex>
  );
};
