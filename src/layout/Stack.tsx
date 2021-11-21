import styled from "@emotion/styled"

export const Stack = styled.div`
  display:flex;
  flex-direction:column;

  flex: 1;

  & > * + * {
    margin-top:3px;
  }
  
  strong {
    max-width: 9em;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  small {
    max-width: 9em;
    text-overflow: ellipsis;
    font-size: 0.8em;
    line-height: 1em;
  }
`
