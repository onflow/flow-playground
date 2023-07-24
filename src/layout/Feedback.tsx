import styled from 'styled-components';

export const Feedback = styled.div<{ height?: number; theme: any }>`
  height: ${(div) => div.height}px;
  border-top: ${({ theme }) => `1px solid ${theme.colors.border}`};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80px;
`;
