import React, { useState } from "react";
import {
  useSetExecutionResultsMutation,
  ResultType
} from "../api/apollo/generated/graphql";

import { FaArrowCircleRight } from "react-icons/fa";
import Button from "./Button";
import { useProject } from "providers/Project/projectHooks";
import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { Heading } from "layout/Heading";
import { FeedbackActions } from "layout/FeedbackActions";
import { ClearResults } from "./TransactionBottomBar";

const ScriptBottomBar: React.FC = () => {
  const { createScriptExecution, isSavingCode, project, active } = useProject();

  const [setResult] = useSetExecutionResultsMutation();
  const [executingScript, setExecutingScript] = useState(false);

  return (
    <FeedbackRoot>
      <FeedbackActions>
        <Button
          onClick={async () => {
            if (!executingScript) {
              setExecutingScript(true);

              let rawResult;
              try {
                rawResult = await createScriptExecution();
              } catch (e) {
                console.error(e)
                rawResult = e.toString();
              }

              setExecutingScript(false);
              setResult({
                variables: {
                  resultType: ResultType.Script,
                  rawResult,
                  label: project.scriptTemplates[active.index].title
                }
              });
            }
          }}
          disabled={isSavingCode}
          isLoading={executingScript}
          Icon={FaArrowCircleRight}
        >
          Execute
        </Button>
      </FeedbackActions>
      <Heading>
        Script Results <ClearResults type={ResultType.Script} />
      </Heading>
      <RenderResponse resultType={ResultType.Script} />
    </FeedbackRoot>
  );
};

export default ScriptBottomBar;
