import { useQuery } from '@apollo/react-hooks';
import { GET_CACHED_EXECUTION_RESULTS } from 'api/apollo/queries';
import React from 'react';
import { Line as LineType } from 'util/normalize-interaction-response';
import { Line } from 'components/Editor/BottomEditorPanel/RenderResponse/Line';
import { useProject } from 'providers/Project/projectHooks';
import { PROJECT_SERIALIZATION_KEY } from 'providers/Project/projectMutator';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import { getResultType } from 'components/Editor/CadenceEditor/ControlPanel/utils';

const styles: SXStyles = {
  root: {
    flex: 1,
    gap: 3,
    flexDirection: 'column',
    counterReset: 'lines',
    minHeight: '40px',
    padding: 6,
    background: 'background',
    borderRadius: '8px',
    overflowY: 'auto',
    height: '100%',
  },
};

export const RenderResponse = () => {
  const { active } = useProject();
  const { data, error, loading } = useQuery(GET_CACHED_EXECUTION_RESULTS, {
    context: {
      serializationKey: PROJECT_SERIALIZATION_KEY,
    },
  });
  const resultType = getResultType(active.type);
  const filteredResults = resultType
    ? data.cachedExecutionResults[resultType]
    : [];

  return (
    <Flex sx={styles.root} data-test="execution-results">
      {filteredResults.length > 0
        ? !loading &&
          !error &&
          filteredResults
            .reverse()
            .map((line: LineType, n: number) => (
              <Line {...line} key={n} index={n} />
            ))
            .reverse()
        : 'Welcome to the Playground!'}
    </Flex>
  );
};
