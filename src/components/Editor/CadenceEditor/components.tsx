import { keyframes } from 'styled-components';
import styled from 'styled-components';
import { ThemedComponentProps } from 'src/types';

const blink = keyframes`
  50% {
    opacity: 0.5;
  }
`;

interface EditorContainerProps extends ThemedComponentProps {
  show: boolean;
  id: string;
  children: React.ReactNode;
  ref: any;
  theme: any;
}

export const EditorContainer = styled.div<EditorContainerProps>`
  width: 100%;
  height: 100%;
  border-left: ${({ theme }) => `1px solid ${theme.colors.outline}`};
  border-right: ${({ theme }) => `1px solid ${theme.colors.outline}`};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.outline}`};
  background-color: ${({ theme }) => theme.colors.primary};

  display: ${({ show = true }) => (show ? 'block' : 'none')};

  .drag-box {
    width: fit-content;
    height: fit-content;
    position: absolute;
    right: 30px;
    bottom: 20px;
    z-index: 12;
  }

  .constraints {
    width: 96vw;
    height: 90vh;
    position: fixed;
    left: 2vw;
    right: 2vw;
    top: 2vw;
    bottom: 2vw;
    pointer-events: none;
  }

  .playground-syntax-error-hover {
    background-color: rgba(238, 67, 30, 0.1);
  }

  .playground-syntax-error-hover-selection {
    background-color: rgba(238, 67, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-warning-hover {
    background-color: rgb(238, 169, 30, 0.1);
  }

  .playground-syntax-warning-hover-selection {
    background-color: rgb(238, 169, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-info-hover {
    background-color: rgb(85, 238, 30, 0.1);
  }

  .playground-syntax-info-hover-selection {
    background-color: rgb(85, 238, 30, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-hint-hover,
  .playground-syntax-unknown-hover {
    background-color: rgb(160, 160, 160, 0.1);
  }

  .playground-syntax-hint-hover-selection,
  .playground-syntax-unknown-hover-selection {
    background-color: rgb(160, 160, 160, 0.3);
    border-radius: 3px;
    animation: ${blink} 1s ease-in-out infinite;
  }

  .playground-syntax-hightlight-hover-selection {
    background-color: rgb(238, 169, 30, 0.3);
    border-radius: 3px;
  }
`;
