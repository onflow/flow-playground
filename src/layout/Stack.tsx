import styled from 'styled-components';

export const Stack = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;

  & > * + * {
    margin-top: 3px;
  }

  strong,
  small {
    max-width: 9em;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
