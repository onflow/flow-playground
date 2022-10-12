import { useQuery } from '@apollo/react-hooks';
import { ResultType } from 'api/apollo/generated/graphql';
import { GET_CACHED_EXECUTION_RESULTS } from 'api/apollo/queries';
import React from 'react';
import { Line as LineType } from 'util/normalize-interaction-response';

import styled from '@emotion/styled';
import { Line } from 'components/RenderResponse/Line';
import { PROJECT_SERIALIZATION_KEY } from 'providers/Project/projectMutator';

const Root = styled.div<{ resultType: ResultType }>`
  counter-reset: lines;
  padding: 8px;
  overflow-y: scroll;
  min-height: 40px;
`;

export const RenderResponse: React.FC<{
  resultType: ResultType.Transaction | ResultType.Script | ResultType.Contract;
}> = ({ resultType }) => {
  const { data, error, loading } = useQuery(GET_CACHED_EXECUTION_RESULTS, {
    context: {
      serializationKey: PROJECT_SERIALIZATION_KEY,
    },
  });
  const dataTest = `${resultType}-response`;
  return (
    <Root resultType={resultType} data-test={dataTest}>
      {!loading &&
        !error &&
        data.cachedExecutionResults[resultType].map(
          (line: LineType, n: number) => <Line {...line} key={n} />,
        )}
    </Root>
  );
};
