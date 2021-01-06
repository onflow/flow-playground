import styled from '@emotion/styled';

interface FullScreenContainerProps {
  elevation?: number;
}

export const FullScreenContainer = styled.div<FullScreenContainerProps>`
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

export const WhiteOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: -1;
`;

interface PopupContainerProps {
  width?: string;
}

export const PopupContainer = styled.div<PopupContainerProps>`
  display: flex;
  width: ${({ width }) => width};
  max-width: 30%;
  flex-direction: column;
  padding: 10px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
  box-sizing: border-box;
`;

interface CommonProps {
  mb?: string;
  color?: string;
}

export const PopupHeader = styled.h3<CommonProps>`
  font-size: 14px;
  color: ${({ color = 'inherit' }) => color};
  margin-bottom: ${({ mb = '0' }) => mb};
`;

export const SpaceBetween = styled.div<CommonProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: ${({ mb = '0' }) => mb};
`;
