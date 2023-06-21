import styled from 'styled-components';
import theme from '../../../../../theme';

interface HoverPanelProps {
  minWidth?: string;
}

export const HoverPanel = styled.div<HoverPanelProps>`
  min-width: ${({ minWidth }) => minWidth};
  max-width: 362px;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #abb3bf;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.08);
`;

interface HidableProps {
  hidden: Boolean;
}
export const Hidable = styled.div<HidableProps>`
  display: ${({ hidden = false }) => (hidden ? 'none' : 'block')};
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
`;

interface TitleProps {
  lineColor?: string;
}

export const Title = styled.div<TitleProps>`
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  color: #919191;

  &:after {
    opacity: 0.5;
    content: '';
    display: block;
    position: absolute;
    left: 0;
    background: ${(props: any) => props.lineColor || theme.colors.primary};
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
  width: 100%;
  cursor: pointer;
`;

export const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
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

  background-color: #ee431e;
  &.warning {
    background-color: ${theme.colors.warning};
  }
  &.info {
    background-color: ${theme.colors.infoBackground};
  }
`;

interface ListProps {
  hidden?: boolean;
}
export const List = styled.div<ListProps>`
  display: ${({ hidden }) => (hidden ? 'none' : 'grid')};
  grid-gap: 12px;
  grid-template-columns: 100%;
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem;
`;

export const SignersContainer = styled.div``;

interface ControlContainerProps {
  isOk: boolean;
  progress: boolean;
  showPrompt?: boolean;
}
interface MessageProps {
  isOk?: boolean;
}

export const ControlContainer = styled.div<ControlContainerProps>`
  display: ${({ showPrompt }) => (showPrompt ? 'block' : 'flex')};
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  width: 100%;
  border-top: 1px solid #abb3bf;
  color: ${({ isOk, progress, showPrompt }) => {
    switch (true) {
      case progress:
        return '#a2a2a2';
      case isOk && showPrompt:
        return theme.colors.error;
      case isOk:
        return '#2bb169';
      default:
        return '#EE431E';
    }
  }};
`;

export const ToastContainer = styled.div`
  z-index: 1000;
  position: fixed;
  bottom: 40px;
  left: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.colors.darkPrimary};
`;

export const StatusMessage = styled.div<MessageProps>`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  display: flex;
  width: ${({ isOk }) => (isOk ? '100%' : '50%')};
  padding: ${({ isOk }) => (isOk ? '1rem' : 'unset')};
  justify-content: flex-start;
  font-size: 16px;
  cursor: pointer;
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
  background: #f6f7f9;
  border-radius: 8px 8px 8px 0px;
`;

export const SingleError = styled.div`
  cursor: pointer;
  display: flex;
  align-items: baseline;
  box-sizing: border-box;
  padding: 10px;
  font-size: 14px;
  background: #ffffff;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  &:hover {
    background-color: rgba(244, 57, 64, 0.15);
  }
  &.hint-warning {
    //background-color: rgb(238, 169, 30, 0.15);
    background-color: ${theme.colors.warning};
  }

  &.hint-info {
    background-color: ${theme.colors.info};
  }
`;

export const ErrorIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    padding-right: 3px;
  }
`;

export const ErrorMessage = styled.p`
  line-height: 1.2;
  word-break: break-word;
  span {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 3px;
    margin: 3px 3px 3px 5px;
    line-height: 20px;
    .suggestion {
      background-color: ${theme.colors.primary};
    }
  }
`;

export const SignersError = styled.p`
  cursor: pointer;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 10px 0;
  color: ${theme.colors.error};
  svg {
    margin-right: 0.5em;
  }
`;
