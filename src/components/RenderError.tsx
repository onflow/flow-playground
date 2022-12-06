
import React from 'react';
import { CadenceProblem } from 'util/language-syntax-errors';
import { ErrorIndex, ErrorMessage, List, SingleError } from './Arguments/styles';
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
    width: '100%'
  }
}

const RenderError = (props: any) => {

  const list = props.list.error ?? [];

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.list}>
        {list.map((item: CadenceProblem, i: number) => {
          const message = renderMessage(item.message);
          return (
            <SingleError
              key={i}
            >
              <ErrorIndex>
                <span>{i + 1}</span>
              </ErrorIndex>
              <ErrorMessage>{message}</ErrorMessage>
            </SingleError>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default RenderError;