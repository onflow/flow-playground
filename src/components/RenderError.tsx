import React from 'react';
import { CadenceProblem } from 'util/language-syntax-errors';
import { ErrorMessage } from './Arguments/styles';
import { renderMessage } from './Arguments/components';
import { Flex } from 'theme-ui';
import { SXStyles } from 'src/types';

const styles: SXStyles = {
  root: {
    flex: 1,
    gap: 3,
    flexDirection: 'column-reverse',
    counterReset: 'lines',
    minHeight: '40px',
    padding: 6,
    background: 'background',
    borderRadius: '8px',
    overflowY: 'auto',
    height: '100%',
  },
  list: {
    flexDirection: 'column',
    width: '100%',
  },
  errorLine: {
    cursor: 'pointer',
    alignItems: 'baseline',
    boxSizing: 'border-box',
    padding: '10px',
    fontSize: '14px',
    background: '#ffffff',
    margin: '4px 0px',
    boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(244, 57, 64, 0.15)',
    },
  },
  index: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
};

const RenderError = (props: any) => {
  const list = props.list.error ?? [];

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.list}>
        {list.length > 1
          ? list.map((item: CadenceProblem, i: number) => {
              const message = renderMessage(item.message);
              return (
                <Flex sx={styles.errorLine} key={i}>
                  <Flex sx={styles.index}>
                    <span>{i + 1}</span>
                  </Flex>
                  <ErrorMessage>{message}</ErrorMessage>
                </Flex>
              );
            })
          : 'Nice! No Syntax Errors Found.'}
      </Flex>
    </Flex>
  );
};

export default RenderError;
