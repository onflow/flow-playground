import React from "react";
import { ResultType } from "api/apollo/generated/graphql";

import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { Heading } from "layout/Heading";
import { ClearResults } from "./TransactionBottomBar";

const ScriptBottomBar: React.FC = () => {
  return (
    <FeedbackRoot>
      <Heading>
        Script Results <ClearResults type={ResultType.Script} />
      </Heading>
      <RenderResponse resultType={ResultType.Script} />
    </FeedbackRoot>
  );
};

export default ScriptBottomBar;
