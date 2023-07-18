import styled from '@emotion/styled';
import React from 'react';
import { ThemedComponentProps } from 'src/types';

interface SidebarItemInsertProps extends ThemedComponentProps {
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  grab?: boolean;
}

export const SidebarItemInsert = styled.button<SidebarItemInsertProps>`
  border: none;
  padding: none;
  background: transparent;
  position: absolute;
  right: 0.75rem;
  top: 56%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.icons};
    cursor: ${(p) => (p.grab ? 'grab' : 'pointer')};
  }
  &:active {
    cursor: ${(p) => (p.grab ? 'grabbing' : 'pointer')};
  }
  &:disabled {
    opacity: 0.8;

    &:hover {
      opacity: 0.7;
      cursor: 'default';
    }
  }
`;
