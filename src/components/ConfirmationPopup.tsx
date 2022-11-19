import { default as FlowButton } from 'components/LegacyButton';
import React from 'react';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  SpaceBetween,
  WhiteOverlay,
} from 'components/Common';

import { Label } from 'components/Arguments/SingleArgument/styles';

const containerFrames = {
  visible: {
    display: 'flex',
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
    zIndex: 200,
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0,
      staggerDirection: -1,
    },
    zIndex: -1,
  },
};

const spring = {
  type: 'spring',
  damping: 11,
  stiffness: 120,
};

const popupFrames = {
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
  hidden: {
    opacity: 0,
    y: -200,
    transition: {
      ease: [1, 0.5, 0, 0],
    },
  },
};

export type ActionsType = {
  name: string;
  action: (...args: any) => void;
  args: any[];
};

type ConfirmationPopupType = {
  title: string;
  message: string;
  onClose: (isConfirmed: boolean) => void;
  visible: boolean;
  actions?: ActionsType[];
};

const ConfirmationPopup = ({
  visible,
  title,
  onClose,
  message,
  actions = null,
}: ConfirmationPopupType) => {
  const closeModal = (isConfirmed: boolean) => {
    onClose(isConfirmed);
  };

  const buttons =
    actions !== null
      ? actions
      : [
          {
            name: 'Confirm',
            action: closeModal,
            args: [true],
          },
          {
            name: 'Close',
            action: closeModal,
            args: [false],
          },
        ];

  if (!visible) return null;

  return (
    <FullScreenContainer
      elevation={15}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={containerFrames}
    >
      <PopupContainer width="350px" variants={popupFrames}>
        <PopupHeader mb="20px" color="#575E89" lineColor="#B4BEFC">
          {title}
        </PopupHeader>
        <Label>{message}</Label>
        <SpaceBetween>
          {buttons.map((btn) => {
            return (
              <FlowButton
                key={btn.name}
                className="grey modal"
                onClick={() => btn.action(...btn.args)}
              >
                {btn.name}
              </FlowButton>
            );
          })}
        </SpaceBetween>
      </PopupContainer>
      <WhiteOverlay onClick={() => closeModal(false)} />
    </FullScreenContainer>
  );
};

export default ConfirmationPopup;
