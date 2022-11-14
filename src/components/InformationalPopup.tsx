import React from 'react'
import ConfirmationPopup, { ActionsType } from './ConfirmationPopup';

type InformationalPopupType = {
  title: string;
  message: string;
  onClose: (...args: any) => void;
  visible: boolean;
};

const InformationalPopup = ({
  visible,
  title,
  onClose,
  message,
}: InformationalPopupType) => {
    const buttons: ActionsType[] = [
        {
            name: 'Confirm',
            action: onClose,
            args: [false],
          },
    ]
  return (
    <ConfirmationPopup
      visible={visible}
      title={title}
      onClose={onClose}
      message={message}
      actions={buttons}
    />
  );
};

export default InformationalPopup