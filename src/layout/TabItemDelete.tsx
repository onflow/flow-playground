import React from 'react';
import styled from '@emotion/styled';

type TabItemDeleteProps = {
  active?: boolean;
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  children?: React.ReactNode;
};

export const TabItemDelete = styled.div<TabItemDeleteProps>`
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  transition: color 0.2s;
  color: #c1c1c1;

  font-size: 0.7rem;
  width: 0.7rem;
  height: 2rem;
  line-height: 2rem;

  padding: 0;
  padding-top: 1px;
  

  position: absolute;
  top: 0;
  right: 0.3rem;
  
  &:hover {
    color: #444;
  }
`;
