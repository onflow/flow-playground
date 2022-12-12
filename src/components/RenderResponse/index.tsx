import { useQuery } from '@apollo/react-hooks';
import { ResultType } from 'api/apollo/generated/graphql';
import { GET_CACHED_EXECUTION_RESULTS } from 'api/apollo/queries';
import React from 'react';
import { Line as LineType } from 'util/normalize-interaction-response';
import { Line } from 'components/RenderResponse/Line';
import { ActiveEditor, EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import { PROJECT_SERIALIZATION_KEY } from 'providers/Project/projectMutator';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';

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
};

const getResultType = (active: ActiveEditor) => {
  switch (active.type) {
    case EntityType.ContractTemplate:
      return ResultType.Contract;
    case EntityType.TransactionTemplate:
      return ResultType.Transaction;
    case EntityType.ScriptTemplate:
      return ResultType.Script;
    default:
      return undefined;
  }
};

export const RenderResponse = () => {
  const { active } = useProject();
  const { data, error, loading } = useQuery(GET_CACHED_EXECUTION_RESULTS, {
    context: {
      serializationKey: PROJECT_SERIALIZATION_KEY,
    },
  });
  const resultType = getResultType(active);
  const filteredResults = resultType
    ? data.cachedExecutionResults[resultType]
    : [];

  return (
    <Flex sx={styles.root} data-test="execution-results">
      {filteredResults.length > 0
        ? !loading &&
          !error &&
          filteredResults
            .map((line: LineType, n: number) => (
              <Line {...line} key={n} index={n} />
            ))
            .reverse()
        : 'Welcome to the Playground!'}
    </Flex>
  );
};
