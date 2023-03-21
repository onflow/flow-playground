import React from 'react';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  SpaceBetween,
  WhiteOverlay,
} from 'components/Common';

import { Label } from 'components/Editor/CadenceEditor/ControlPanel/Arguments/SingleArgument/styles';
import Button, { ButtonVariant } from './Button';
import { Box } from 'theme-ui';

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
    borderRadius: '5px',
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
  variant: ButtonVariant;
  args: any[];
};

type ConfirmationPopupType = {
  title: string;
  messages: string[];
  onClose: (isConfirmed: boolean) => void;
  visible: boolean;
  actions?: ActionsType[];
};

const ConfirmationPopup = ({
  visible,
  title,
  onClose,
  messages,
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
            variant: 'primary' as ButtonVariant,
            args: [true],
          },
          {
            name: 'Close',
            action: closeModal,
            variant: 'secondary' as ButtonVariant,
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
      <PopupContainer width="50%" variants={popupFrames}>
        <PopupHeader mb="20px">{title}</PopupHeader>
        <Box>
          {messages.map((message, i) => {
            return <Label key={i}>{message}</Label>;
          })}
        </Box>
        <SpaceBetween>
          {buttons.map((btn) => {
            return (
              <Button
                key={btn.name}
                variant={btn.variant}
                onClick={() => btn.action(...btn.args)}
              >
                {btn.name}
              </Button>
            );
          })}
        </SpaceBetween>
      </PopupContainer>
      <WhiteOverlay onClick={() => closeModal(false)} />
    </FullScreenContainer>
  );
};

export default ConfirmationPopup;
