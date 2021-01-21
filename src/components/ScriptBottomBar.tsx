import React, { useState, useEffect } from "react";
import { ResultType } from "api/apollo/generated/graphql";
import styled from '@emotion/styled';
import useMousePosition from '../hooks/useMousePosition';
import { RenderResponse } from "components/RenderResponse";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { ResizeHeading } from 'layout/Heading';
import { ClearResults } from "./TransactionBottomBar";


const RESULT_PANEL_MIN_HEIGHT = 180
const PLAYGROUND_HEADER_HEIGHT = 75

const FeedbackContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-even;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 245px;
  background: white;
	width: calc(100vw - 245px);
  height: ${(p) => p.height}px;
	overflow-y: hidden;
`;

const ScriptBottomBar: React.FC = () => {

	const { x, y } = useMousePosition();

  const [resultHeight, setResultHeight] = useState(140);
  const [isResizingResult, setIsResizingResult] = useState(false);


  const toggleResizingResult = (toggle: boolean) => {
    setIsResizingResult(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizingResult(false);
  };

  useEffect(() => {
    if (
      isResizingResult &&
      y > RESULT_PANEL_MIN_HEIGHT &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setResultHeight(y);
    }
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mouseup', toggleResizeListener, false);
    return () => {
      window.removeEventListener('mouseup', toggleResizeListener, false);
    };
  }, []);


  return (
		<FeedbackContainer height={resultHeight}>
    <FeedbackRoot>
      <ResizeHeading onMouseDown={() => toggleResizingResult(true)}>
        Script Results <ClearResults type={ResultType.Script} />
				<div></div>
      </ResizeHeading>
      <RenderResponse resultType={ResultType.Script} />
    </FeedbackRoot>
		</FeedbackContainer>
  );
};

export default ScriptBottomBar;
