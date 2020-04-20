import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getExecutionResultsByType } from "api/apollo/queries";
import { ResultType } from "../../api/apollo/generated/graphql";
import { Line as LineType } from "../../util/normalize-interaction-response";

import { Line } from "components/RenderResponse/Line";
import styled from "@emotion/styled";

const Root = styled.div<{ resultType: ResultType }>`
  counter-reset: lines;
  padding: 8px;
  overflow-y: scroll;
  min-height: 40px;
  max-height: ${p => (p.resultType === ResultType.Contract ? "80px" : "140px")};
`;

export const RenderResponse: React.FC<{
  resultType: ResultType.Transaction | ResultType.Script | ResultType.Contract;
}> = ({ resultType }) => {
  const { data, error, loading } = useQuery(
    getExecutionResultsByType(resultType)
  );
  return (
    <Root resultType={resultType}>
      {!loading &&
        !error &&
        data.executionResults[resultType].map((line: LineType, n: number) => (
          <Line {...line} key={n} />
        ))}
    </Root>
  );
};
