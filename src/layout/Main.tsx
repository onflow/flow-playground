import styled from '@emotion/styled';
import theme from '../theme';

export const Main = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.secondaryBackground};
  overflow: hidden;
`;
