import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import theme from "../theme";

type SidebarItemInputProps = {
  type: string;
  defaultValue: string;
  active?: boolean;
  onClick?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  onBlur?: (e: React.SyntheticEvent<Element, Event>) => any | void;
  children?: React.ReactNode;
  readonly?: boolean;
};

export const SidebarItemInput = styled.input<SidebarItemInputProps>`
  font-family: Overpass, sans-serif;
  -moz-appearance: none;
  -webkit-appearance: none;
  width: 100%;
  margin-right: 0.5rem;
  border: none;
  font-size: 15px;
  color: #6a6a6a;
  font-weight: 600;
  background: var(--bg);
  text-overflow: ellipsis;
  border: ${p => (p.readonly ? "1px solid transparent" : `1px solid #dedede`)};
  pointer-events: ${p => (p.readonly ? "none" : "initial")};
  background: ${p => (p.readonly ? "none" : "#ffffff")};
  padding: 4px;
  border-radius: 4px;
  margin-left: -5px;
  ::placeholder {
    color: ${theme.colors.text};
  }
  + .editIcon {
    opacity: 0;
  }
  &:hover + .editIcon {
    opacity: 1;
  }
  ${p =>
    p.onClick &&
    css`
      cursor: pointer;
      &:hover,
      &:focus {
        background: rgba(255, 255, 255, 0.75);
      }
    `}
`;
