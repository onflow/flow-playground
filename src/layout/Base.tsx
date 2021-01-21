import styled from "@emotion/styled";
import theme from "../theme";

export const Base = styled.div`
  --gap: 1px;
  --key: ${theme.colors.greyBorder};
  --bg: white;

  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 100vh;
  display: grid;
  grid-gap: var(--gap) var(--gap);
  grid-template-areas:
    "header header"
    "sidebar main";
  grid-template-columns: 244px auto;
  grid-template-rows: 72px auto;
  background: var(--key);
  overflow: hidden;
`;
