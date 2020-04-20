import styled from "@emotion/styled"

export const Stack = styled.div`
  display:flex;
  flex-direction:column;

  & > * + * {
    margin-top:3px;
  }
`
