import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled.p`
  margin: 0;
  font-size: 12px;
  margin-bottom: 1em;
  color: #000;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Type = styled.span`
  font-weight: normal;
  color: #3E98EB;
  margin-left: 4px;
  &:before{
    content: "(";
  }
  &:after{
    content: ")";
  }
`

export const Input = styled.input`
  border: 1px solid #C4C4C4;
  font-size: 14px;
  color: #000;
  padding: 8px;
  width: 100%;
  font-weight: bold;
`;