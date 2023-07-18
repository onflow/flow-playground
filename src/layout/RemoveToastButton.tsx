import styled from '@emotion/styled';
import { ThemedComponentProps } from 'src/types';

export const RemoveToastButton = styled.button<ThemedComponentProps>`
  border: none;
  background: transparent;
  transform: translate(25%, 50%);
  color: ${({ theme }) => theme.colors.border};
  &:hover {
    color: ${({ theme }) => theme.colors.icons};
  }
`;
