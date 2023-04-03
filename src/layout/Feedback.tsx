import styled from '@emotion/styled';
import theme from '../theme';

export const Feedback = styled.div<{ height?: number }>`
  height: ${(div) => div.height}px;
  border-top: 1px solid ${theme.colors.greyBorder};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 80px;
`;
