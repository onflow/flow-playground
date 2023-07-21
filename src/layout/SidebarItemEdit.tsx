import styled from 'styled-components';
import React from 'react';
import { ChildPropsOptional } from 'src/types';

interface SidebarItemEditProps extends ChildPropsOptional {
  active?: boolean;
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
}

export const SidebarItemEdit = styled.div<SidebarItemEditProps>`
    -moz-appearance: none;
    -webkit-appearance: none;
    display: block;
    justify-self: flex-end;
    transition: color: 0.2s;
    color: #c1c1c1;
    font-size: 14px;
    padding: 5px;
    border-radius: 5px;
    &:hover {
      color: #9a9a9a;
      background: #e6e6e6;
    }
`;
