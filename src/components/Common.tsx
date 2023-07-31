import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemedComponentProps } from 'src/types';

interface FullScreenContainerProps {
  elevation?: number;
}

export const FullScreenContainer = styled(motion.div)<FullScreenContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ elevation = 0 }) => elevation};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
`;

interface WhiteOverlayProps extends ThemedComponentProps {
  opacity?: number;
}

export const WhiteOverlay = styled.div<WhiteOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.primary};
  z-index: -1;
`;

interface PopupContainerProps extends ThemedComponentProps {
  width?: string;
}

export const PopupContainer = styled(motion.div)<PopupContainerProps>`
  display: flex;
  width: ${({ width }) => width};
  max-width: 75%;
  flex-direction: column;
  padding: 40px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => `0px 0px 10px 0px ${theme.colors.shadow}`};
  z-index: 2;
  box-sizing: border-box;
`;

interface CommonProps {
  mb?: string;
  color?: string;
  lineColor?: string;
}

export const PopupHeader = styled.h3<CommonProps>`
  font-size: 32px;
  font-weight: bold;
  color: ${({ color = 'inherit' }) => color};
  margin-bottom: 16px;
`;

export const DontShowFooter = styled.div<CommonProps>`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  > span {
    font-size: 14px;
    margin-left: 6px;
  }
`;
export const SpaceBetween = styled.div<CommonProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 16px;
`;

export const Separator = styled.div<ThemedComponentProps>`
  width: 2px;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin: 0 16px;
`;
