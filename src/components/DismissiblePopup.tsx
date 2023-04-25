import React, { ChangeEvent, useMemo } from 'react';
import { userDataKeys, UserLocalStorage } from 'util/localstorage';
import ConfirmationPopup, { ActionsType } from './ConfirmationPopup';

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
  const userStorageValueVisible = useMemo(
    () => Boolean(userLocalStorage.getDataByKey(storageKey)),
    [storageKey],
  );

  if (!visible) return null;

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
