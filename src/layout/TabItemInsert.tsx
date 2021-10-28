import React from "react";
import styled from "@emotion/styled";
import theme from "../theme";

type TabItemInsertProps = {
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  grab?: boolean;
};

export const TabItemInsert = styled.button<TabItemInsertProps>`
  border: none;
  padding: none;
  background: transparent;
  position: absolute;
  left: 0rem;
  top: 56%;
  transform: translateY(-50%);

  margin: 0 0 0 -0.7rem;

  color: ${theme.colors.grey};
  &:hover {
    color: ${theme.colors.heading};
    cursor: ${p => (p.grab ? "grab" : "pointer")};
  }
  &:active {
    cursor: ${p => (p.grab ? "grabbing" : "pointer")};
  }
`;
