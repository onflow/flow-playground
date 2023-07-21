import LegacyButton from 'components/LegacyButton';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { ThemedComponentProps } from 'src/types';

export const MotionBox = (props: any) => {
  const { children, dragConstraints } = props;
  return (
    <motion.div
      className="drag-box"
      drag={true}
      dragConstraints={dragConstraints}
      dragElastic={0}
      whileDrag={{ scale: '1.1', opacity: '0.5' }}
      dragMomentum={false}
    >
      {children}
    </motion.div>
  );
};

interface HoverPanelProps extends ThemedComponentProps {
  width?: string;
}

export const HoverPanel = styled.div<HoverPanelProps>`
  min-width: 362px;
  max-width: 500px;
  padding: 20px;
  border-radius: 4px;
  background-color: ${(props: any) => props.theme.colors.primary};
  box-shadow: ${({ theme }) =>
    `10px 10px 20px #c9c9c9, -10px -10px 20px ${theme.colors.shadow}`};
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

interface TitleProps extends ThemedComponentProps {
  lineColor?: string;
}

export const Title = styled.div<TitleProps>`
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  color: ${({ theme }) => theme.colors.text};

  &:after {
    opacity: 0.5;
    content: '';
    display: block;
    position: absolute;
    left: 0;
    background: ${(props: any) =>
      props.lineColor || props.theme.colors.primary};
    height: 3px;
    width: 1rem;
    bottom: -6px;
    border-radius: 3px;
  }
`;

export const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
`;

export const Badge = styled.div<ThemedComponentProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 12px;
  margin-right: 5px;

  --size: 16px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);

  span {
    transform: translateY(1px);
  }

  background-color: ${({ theme }) => theme.colors.errorBackground};
  &.warning {
    background-color: ${({ theme }) => theme.colors.warning};
  }
`;

interface ListProps {
  hidden?: boolean;
}
export const List = styled.div<ListProps>`
  display: ${({ hidden }) => (hidden ? 'none' : 'grid')};
  grid-gap: 12px;
  grid-template-columns: 100%;
  margin-bottom: 24px;
  max-height: 350px;
  overflow-y: auto;
`;

export const SignersContainer = styled.div`
  margin-bottom: 20px;
`;

interface ControlContainerProps {
  isOk: boolean;
  progress: boolean;
}
export const ControlContainer = styled.div<ControlContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ isOk, progress }) => {
    switch (true) {
      case progress:
        return '#a2a2a2';
      case isOk:
        return '#2bb169';
      default:
        return '#EE431E';
    }
  }};
`;

export const ToastContainer = styled.div<ThemedComponentProps>`
  z-index: 1000;
  position: fixed;
  bottom: 40px;
  left: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.accent};
`;

export const StatusMessage = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  display: flex;
  justify-content: flex-start;
  font-size: 16px;
  svg {
    margin-right: 5px;
  }

  svg.spin {
    animation: spin 0.5s linear infinite;
  }
`;

export const ErrorsContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 100%;
  margin-bottom: 12px;
`;

export const ErrorIndex = styled.div`
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-right: 8px;
  flex: 0 0 auto;
`;

export const ErrorMessage = styled.p<ThemedComponentProps>`
  line-height: 1.2;
  word-break: break-word;
  span {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 3px;
    margin: 3px 3px 3px 5px;
    line-height: 20px;
    .suggestion {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const Confirm = styled(LegacyButton)<ThemedComponentProps>`
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.primary};

  margin-right: 0.5rem;

  &:active {
    background-color: ${({ theme }) => theme.colors.errors};
  }
`;

export const PromptActionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

interface StatusIconProps extends ThemedComponentProps {
  isOk: boolean;
  progress: boolean;
  showPrompt: boolean;
}
export const StatusIcon = styled.div<StatusIconProps>`
  color: ${({ theme, isOk, progress, showPrompt }) => {
    switch (true) {
      case progress:
        return '#a2a2a2';
      case isOk && showPrompt:
        return theme.colors.warning;
      case isOk:
        return '#2bb169';
      default:
        return '#EE431E';
    }
  }};
`;
