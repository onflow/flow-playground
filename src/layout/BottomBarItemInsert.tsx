import React from "react";
import styled from "@emotion/styled";
import theme from "../theme";

type SidebarItemInsertProps = {
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  grab?: boolean;
};

export const BottomBarItemInsert = styled.button<SidebarItemInsertProps>`
  border: none;
  padding: none;
  background: transparent;
  align-content: center;

  color: ${theme.colors.darkGrey};
  &:hover {
    color: ${theme.colors.heading};
    cursor: ${p => (p.grab ? "grab" : "pointer")};
  }
  &:active {
    cursor: ${p => (p.grab ? "grabbing" : "pointer")};
  }
`;
