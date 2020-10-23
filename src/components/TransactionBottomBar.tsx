import React from "react";
import {
  useClearExecutionResultsMutation,
  ResultType
} from "api/apollo/generated/graphql";

import { FaEraser } from "react-icons/fa";
import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { Heading } from "layout/Heading";

import styled from "@emotion/styled";
import theme from "../theme";

const Clear = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  span {
    padding-right: 0.2rem;
  }
  &:hover {
    cursor: pointer;
    color: ${theme.colors.error};
  }
`;

export const ClearResults: React.FC<{ type: ResultType }> = ({ type }) => {
  const [clearResults] = useClearExecutionResultsMutation();
  return (
    <Clear
      onClick={() =>
        clearResults({
          variables: {
            resultType: type
          }
        })
      }
    >
      <span>clear</span> <FaEraser></FaEraser>
    </Clear>
  );
};

const TransactionBottomBar: React.FC = () => {
  return (
    <FeedbackRoot>
      <Heading>
        Transaction Results
        <ClearResults type={ResultType.Transaction} />
      </Heading>
      <RenderResponse resultType={ResultType.Transaction} />
    </FeedbackRoot>
  );
};

export default TransactionBottomBar;
