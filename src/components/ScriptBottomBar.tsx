import React from "react";
import { ResultType } from "api/apollo/generated/graphql";

import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { Heading } from "layout/Heading";
import { ClearResults } from "./TransactionBottomBar";
import { GoChevronDown } from 'react-icons/go';

const ScriptBottomBar: React.FC = () => {
  return (
    <FeedbackRoot>
      <Heading>
        Script Results <ClearResults type={ResultType.Script} />
				<GoChevronDown
            size="16px"
            onClick={() => {

            }}
          />
      </Heading>
      <RenderResponse resultType={ResultType.Script} />
    </FeedbackRoot>
  );
};

export default ScriptBottomBar;
