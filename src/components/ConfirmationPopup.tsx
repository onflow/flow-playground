import { default as FlowButton } from 'components/LegacyButton';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useRef, useState } from 'react';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  SpaceBetween,
  WhiteOverlay,
} from 'components/Common';

import {
  Label,
} from 'components/Arguments/SingleArgument/styles';

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

type ConfirmationPopupType = {
  title: string;
  message: string;
  onClose: (isConfirmed: boolean) => void;
  visible: boolean;
};

const ConfirmationPopup = ({
  visible,
  title,
  onClose,
  message,
}: ConfirmationPopupType) => {

const closeModal = (isConfirmed: boolean) => {
    console.log('closing')
    onClose(isConfirmed)
}

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
          <FlowButton className="grey modal" onClick={() => closeModal(false)}>
            Close
          </FlowButton>
          <FlowButton className="violet modal" onClick={() => closeModal(true)}>
            Confirm
          </FlowButton>
        </SpaceBetween>
      </PopupContainer>
      <WhiteOverlay onClick={() => closeModal(false)} />
    </FullScreenContainer>
  );
};

export default ConfirmationPopup;
