import styled from "@emotion/styled";
import theme from "../theme";

export const RemoveToastButton = styled.button`
  border: none;
  // padding: none;
  // padding: 0px;
  // margin: 0px;
  // border-radius: 100%;

  background: transparent;
  // background: red;
  // position: absolute;
  // right: 0;
  // top: 0;
  transform: translate(25%, 50%);
  color: ${theme.colors.grey};
  &:hover {
    color: ${theme.colors.heading};
  }
`;
