import styled from "@emotion/styled";
import theme from "../theme";

export const RemoveToastButton = styled.button`
  border: none;
  background: transparent;
  transform: translate(25%, 50%);
  color: ${theme.colors.grey};
  &:hover {
    color: ${theme.colors.heading};
  }
`;
