import styled from '@emotion/styled';

export const Feedback = styled.div<{ height?: number }>`
  height: ${(div) => div.height}px;
  border-top: var(--gap) solid var(--key);
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80px;
`;
