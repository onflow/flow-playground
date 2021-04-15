import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import {
  Line as LineType,
  Tag
} from "../../../util/normalize-interaction-response";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import theme from "../../../theme";

const PS1 = (tag: Tag) => {
  switch (tag) {
    case Tag.ERROR:
      return "Error";
    case Tag.VALUE:
      return "Result";
    case Tag.UNKNOWN:
      return "Unknown";
    case Tag.LOG:
      return "";
    default:
      return "";
  }
};

const Root = styled.div`
  --gap: 5px;
  --font-family: ${theme.fonts.monospace};
  --font-size: 11px;
  font-family: var(--font-family);
  font-size: var(--font-size);
  display: flex;
  padding: 5px;

  & + & {
    border-top: 1px dashed ${theme.colors.border};
  }
`;

const Label = styled.strong<{ tag: Tag }>`
  margin-right: var(--gap);
  font-weight:bold;

  &:before {
    counter-increment: lines;
    content: "[" counter(lines) "]";
    margin-right: var(--gap);
    color: ${theme.colors.text};
  }

  &:empty {
    margin-right:0;
  }

  & + svg {
    margin-right: var(--gap);
    margin-left:-3px;
  }

  ${p =>
    p.tag === Tag.ERROR &&
    css`
      color: ${theme.colors.error};
    `}
  ${p =>
    p.tag === Tag.VALUE &&
    css`
      color: ${theme.colors.purple};
    `}
  ${p =>
    p.tag === Tag.UNKNOWN &&
    css`
      color: ${theme.colors.error};
    `}
`;

const StringValue = styled.pre<{ tag: Tag }>`
  ${p =>
    p.tag === Tag.ERROR &&
    css`
      color: ${theme.colors.error};
    `}
`;

const ObjectValue = styled.pre`
  border-radius: 3px;
  padding: 13px;
  background: ${theme.colors.muted};
  color: ${theme.colors.background};
  font-family: var(--font-family);
  font-size: var(--font-size);
`;

export const Line: React.FC<LineType> = ({ timestamp, tag, value, label }) => {
  return (
    <Root>
      {timestamp}&nbsp;
      {label && <span style={{ fontWeight: "bold" }}>{label}&nbsp;</span>}
      <IoIosArrowForward />
      <Label tag={tag}>{PS1(tag)}</Label>
      <IoIosArrowForward />
      {
        typeof value === "string"
          ? <StringValue tag={tag}>{value}</StringValue>
          : <ObjectValue>{JSON.stringify(value, null, 2)}</ObjectValue>
      }
    </Root>
  );
};
