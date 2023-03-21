import React from 'react';
import ConfirmationPopup, { ActionsType } from './ConfirmationPopup';

type InformationalPopupType = {
  title: string;
  messages: string[];
  onClose: (...args: any) => void;
  visible: boolean;
};

const InformationalPopup = ({
  visible,
  title,
  onClose,
  messages,
}: InformationalPopupType) => {
  const buttons: ActionsType[] = [
    {
      name: 'Ok',
      variant: 'primary',
      action: onClose,
      args: [false],
    },
  ];
  return (
    <ConfirmationPopup
      visible={visible}
      title={title}
      onClose={onClose}
      messages={messages}
      actions={buttons}
    />
  );
};

export default InformationalPopup;
