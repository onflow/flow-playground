import React from 'react';
import theme from '../../../../../../theme';
import styled from 'styled-components';

interface InpubBlockProps {
  mb?: string;
}

export const InputBlock = styled.div<InpubBlockProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ mb = '0' }) => mb};
  position: relative;
`;

interface LabelProps {
  error?: boolean;
}

export const Label = styled.p<LabelProps>`
  margin: 0;
  font-size: 14px;
  margin-bottom: 5px;
  color: ${({ error }) =>
    error ? `${theme.colors.error}` : `${theme.colors.text}`};
`;

export const Type = styled.span`
  font-weight: normal;
  color: ${theme.colors.accent};
  margin-left: 4px;
  &:before {
    content: '(';
  }
  &:after {
    content: ')';
  }
`;

export const Input = styled.input`
  border: 1px solid ${theme.colors.border};
  border-radius: 5px;
  font-size: 14px;
  color: ${theme.colors.text};
  padding: 8px;
  width: 100%;
  font-weight: bold;
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
  box-sizing: border-box;

  ::placeholder {
    color: ${theme.colors.muted};
  }
`;

export const Error = styled.p`
  font-size: 12px;
  color: ${theme.colors.error};
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
  color: ${theme.colors.muted};
  user-select: none;

  &:hover {
    color: ${theme.colors.text};
  }
`;

type InputIconProps = {
  onClick?: any;
  icon: JSX.Element;
};

export const InputIcon = (props: InputIconProps) => {
  const { onClick, icon } = props;
  return <InputIconContainer onClick={onClick}>{icon}</InputIconContainer>;
};
