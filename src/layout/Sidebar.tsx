import styled from '@emotion/styled';
import theme from '../theme';

export const Sidebar = styled.div`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.secondaryBackground};
  overflow-y: auto;
`;
