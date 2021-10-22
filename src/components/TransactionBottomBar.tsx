import React, { useState, useEffect } from 'react';
import {
  useClearExecutionResultsMutation,
  ResultType,
} from 'api/apollo/generated/graphql';
import useMousePosition from '../hooks/useMousePosition';
import { FaEraser } from 'react-icons/fa';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { RenderResponse } from 'components/RenderResponse';
import { Feedback as FeedbackRoot } from 'layout/Feedback';
import { ResizeHeading } from 'layout/Heading';

import styled from '@emotion/styled';
import theme from '../theme';

const Clear = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: absolute;
  left: 50%;
  span {
    padding-right: 0.2rem;
  }
  &:hover {
    cursor: pointer;
    color: ${theme.colors.error};
  }
`;

const RESULT_PANEL_MIN_HEIGHT = 80;
const PLAYGROUND_HEADER_HEIGHT = 75;

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

export const ClearResults: React.FC<{ type: ResultType }> = ({ type }) => {
  const [clearResults] = useClearExecutionResultsMutation();
  return (
    <Clear
      onClick={() =>
        clearResults({
          variables: {
            resultType: type,
          },
        })
      }
    >
      <span>clear</span> <FaEraser></FaEraser>
    </Clear>
  );
};

interface TransactionBottomBarProps {
  setBottomBarHeight: (height: number) => void;
}

const TransactionBottomBar: React.FC<TransactionBottomBarProps> = ({ setBottomBarHeight }) => {
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
      setBottomBarHeight(y);
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
          Transaction Results
          <ClearResults type={ResultType.Transaction} />
          {resultHeight > 40 ? (
            <GoChevronDown size="16px" onClick={() => setResultHeight(40)} />
          ) : (
            <GoChevronUp
              size="16px"
              onClick={() => setResultHeight(RESULT_PANEL_MIN_HEIGHT * 2)}
            />
          )}
        </ResizeHeading>
        <RenderResponse resultType={ResultType.Transaction} />
      </FeedbackRoot>
    </FeedbackContainer>
  );
};

export default TransactionBottomBar;
