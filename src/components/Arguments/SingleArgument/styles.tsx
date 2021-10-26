import React from 'react'
import styled from "styled-components"

interface InpubBlockProps {
  mb?: string
}

export const InputBlock = styled.div<InpubBlockProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({mb = "0"}) => mb};
  position: relative;
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
  border-radius: 5px;
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

export const InputIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  align-self: center;
  right: 0.75em;
  bottom: 0.9em;
  cursor: pointer;
  color: #888;
  user-select: none;
  
  &:hover{
    color: #333;
  }
`;


type InputIconProps = {
  onClick?: any,
  icon: JSX.Element
}

export const InputIcon = (props: InputIconProps) => {
  const { onClick, icon } = props
  return (
    <InputIconContainer onClick={onClick}>
      {icon}
    </InputIconContainer>
  )
}