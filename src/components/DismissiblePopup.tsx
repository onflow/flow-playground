import React, { ChangeEvent } from 'react';
import { UserLocalStorage } from 'util/localstorage';
import ConfirmationPopup from './ConfirmationPopup';

type DismissiblePopupType = {
  title: string;
  messages: string[];
  onClose: (isConfirmed: boolean) => void;
  visible: boolean;
  storageKey: string;
};

const DismissiblePopup = ({
  visible,
  title,
  onClose,
  messages,
  storageKey,
}: DismissiblePopupType) => {
  const userLocalStorage = new UserLocalStorage();
  if (!visible) return null;
  const userStorageValueVisible = Boolean(
    userLocalStorage.getDataByKey(storageKey),
  );

  // if key is not true then show modal.
  let isShow = visible;
  if (visible && userStorageValueVisible) {
    onClose(true);
  }

  const doCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const value = String(e.target.checked);
    userLocalStorage.setData(storageKey, value);
  };

  return (
    <ConfirmationPopup
      visible={isShow}
      title={title}
      onClose={onClose}
      messages={messages}
      dontShowAgainAction={doCheck}
    />
  );
};

export default DismissiblePopup;
