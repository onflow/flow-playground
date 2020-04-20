import React, { useState } from "react";
import {
  useSetExecutionResultsMutation,
  useClearExecutionResultsMutation,
  ResultType
} from "../api/apollo/generated/graphql";

import { FaArrowCircleRight, FaEraser } from "react-icons/fa";
import Button from "./Button";
import { useProject } from "providers/Project/projectHooks";
import AccountPicker from "components/AccountPicker";
import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { Heading } from "layout/Heading";
import { FeedbackActions } from "layout/FeedbackActions";

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
  const {
    project,
    active,
    createTransactionExecution,
    transactionAccounts,
    updateSelectedTransactionAccounts,
    isSavingCode
  } = useProject();

  const accounts = project.accounts;

  const [setResult] = useSetExecutionResultsMutation();
  const [sendingTransaction, setSendingTransaction] = useState(false);

  return (
    <FeedbackRoot>
      <FeedbackActions>
        <AccountPicker
          project={project}
          accounts={accounts}
          selected={transactionAccounts}
          onChange={selected => updateSelectedTransactionAccounts(selected)}
        >
          <Button
            onClick={async () => {
              if (!sendingTransaction) {
                setSendingTransaction(true);

                const signers = transactionAccounts.map(
                  (i: number) => accounts[i]
                );
                const rawResult = await createTransactionExecution(signers);

                setSendingTransaction(false);
                setResult({
                  variables: {
                    resultType: ResultType.Transaction,
                    rawResult,
                    label: project.transactionTemplates[active.index].title
                  }
                });
              }
            }}
            disabled={isSavingCode}
            isLoading={sendingTransaction}
            Icon={FaArrowCircleRight}
          >
            Send
          </Button>
        </AccountPicker>
      </FeedbackActions>
      <Heading>
        Transaction Results
        <ClearResults type={ResultType.Transaction} />
      </Heading>
      <RenderResponse resultType={ResultType.Transaction} />
    </FeedbackRoot>
  );
};

export default TransactionBottomBar;
