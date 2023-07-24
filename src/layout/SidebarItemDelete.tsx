import styled from 'styled-components';
import React from 'react';
import { ChildPropsOptional } from 'src/types';

interface SidebarItemDeleteProps extends ChildPropsOptional {
  active?: boolean;
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
}

export const SidebarItemDelete = styled.div<SidebarItemDeleteProps>`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  justify-self: flex-end;
  transition: color 0.2s;
  color: #c1c1c1;
  margin-left: 0.5rem;
  font-size: 14px;
  padding: 5px;
  border-radius: 5px;
  &:hover {
    color: #9a9a9a;
    background: #e6e6e6;
  }
`;
