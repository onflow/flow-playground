import styled from '@emotion/styled';
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
  //  background: rgba(255, 255, 255, ${({ opacity = 0.9 }) => opacity});
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
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1), 0 0 3px 1px rgba(0, 0, 0, 0.05);
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
