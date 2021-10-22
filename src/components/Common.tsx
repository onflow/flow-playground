import styled from '@emotion/styled';
import { motion } from "framer-motion";

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

interface WhiteOverlayProps {
  opacity?: number;
}

export const WhiteOverlay = styled.div<WhiteOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, ${({ opacity = 0.9 }) => opacity});
  z-index: -1;
`;

interface PopupContainerProps {
  width?: string;
}

export const PopupContainer = styled(motion.div)<PopupContainerProps>`
  display: flex;
  width: ${({ width }) => width};
  max-width: 50%;
  flex-direction: column;
  padding: 20px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1), 0 0 3px 1px rgba(0,0,0,0.05);
  z-index: 2;
  box-sizing: border-box;
`;

interface CommonProps {
  mb?: string;
  color?: string;
  lineColor?: string;
}

export const PopupHeader = styled.h3<CommonProps>`
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ color = 'inherit' }) => color};
  margin-bottom: ${({ mb = '0' }) => mb};
  :after{
    content: "";
    display: block;
    height: 3px;
    width: 16px;
    background-color: ${({lineColor = "currentColor"}) => lineColor};
    margin-top: 4px;
  }
`;

export const SpaceBetween = styled.div<CommonProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: ${({ mb = '0' }) => mb};
`;

export const Separator = styled.div`
  width: 2px;
  height: 30px;
  background-color: #ccc;
  margin: 0 16px;
`;
