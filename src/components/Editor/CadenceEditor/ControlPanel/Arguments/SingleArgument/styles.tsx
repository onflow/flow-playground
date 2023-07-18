import { ThemedComponentProps } from 'src/types';
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

interface LabelProps extends ThemedComponentProps {
  error?: boolean;
}

export const Label = styled.p<LabelProps>`
  margin: 0;
  font-size: 14px;
  margin-bottom: 5px;
  color: ${({ theme, error }) =>
    error ? `${theme.colors.error}` : `${theme.colors.text}`};
`;

export const Type = styled.span<ThemedComponentProps>`
  font-weight: normal;
  color: ${({ theme }) => theme.colors.accent};
  margin-left: 4px;
  &:before {
    content: '(';
  }
  &:after {
    content: ')';
  }
`;

export const Input = styled.input<ThemedComponentProps>`
  background-color: ${({ theme }) => theme.colors.secondaryBackground};
  border: ${({ theme }) => `1px solid ${theme.colors.active}`};
  border-radius: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px;
  width: 100%;
  font-weight: bold;
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
  box-sizing: border-box;

  ::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const Error = styled.p<ThemedComponentProps>`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
`;
