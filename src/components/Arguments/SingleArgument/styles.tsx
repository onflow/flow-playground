import styled from "styled-components"

interface InpubBlockProps {
  mb?: string
}

export const InputBlock = styled.div<InpubBlockProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({mb = "0"}) => mb};
`

export const Label = styled.p`
  margin: 0;
  font-size: 14px;
  margin-bottom: 5px;
  color: #000;
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
  margin-bottom: 5px;
  &:last-child{
    margin-bottom: 0;
  }
`;

export const Error = styled.p`
  font-size: 12px;
  color: red;
`;