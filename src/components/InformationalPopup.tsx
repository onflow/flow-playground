import React from 'react';
import ConfirmationPopup, { ActionsType } from './ConfirmationPopup';

type InformationalPopupType = {
  title: string;
  messages: string[];
  onClose: (...args: any) => void;
  visible: boolean;
  disableActions?: boolean;
};

const InformationalPopup = ({
  visible,
  title,
  onClose,
  messages,
  disableActions = false,
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
      actions={disableActions ? [] : buttons}
    />
  );
};

export default InformationalPopup;
