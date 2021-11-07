import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import theme from "../theme";

type ItemProps = {
  active?: boolean;
  children?: React.ReactNode;
};

export const TabItem = styled.div<ItemProps>`

  font-size: 0.7rem;
  padding: 0 2rem 0 1rem;
  position: relative;

  min-width: 8rem;
  max-width: 10rem;
  overflow: none;

  height: 2rem;
  line-height: 2rem;
  margin-right: 0.7rem;

  background-color: rgba(225, 225, 225, 0.1);

  border-top: 1px solid rgba(225, 225, 225, 0.2);
  border-right: 1px solid rgba(225, 225, 225, 0.3);
  box-shadow: rgba(0, 0, 0, 0.05) 1px 1px 1px 0px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 6px;
    height: auto;
    border-radius: 0 3px 3px 0;
    background-color: rgba(225, 225, 225, 0.3);
  };

  ${p =>
    p.active &&
    css`
      & {
        background-color: #f0f0f0;
      }

      &:after {
        background-color: ${theme.colors.primary};
      }
    `}

  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #f0f0f0;

    &:after {
      background: ${theme.colors.primary};
    }
  }
  text-decoration: none;
  display:inline-block;
  align-items: center;
  color: ${theme.colors.muted};

  & .avatar {
    margin-right: 1rem;
    width: 35px;
    height: 35px;
    border-radius: 0 0 20px 20px;
  }

  & small,
  & .mute {
    font-weight: normal;
    color: ${theme.colors.heading};
    font-size: 13px;
  }
`;
