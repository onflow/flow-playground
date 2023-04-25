import React, { ChangeEvent, useMemo } from 'react';
import { userDataKeys, UserLocalStorage } from 'util/localstorage';
import ConfirmationPopup, { ActionsType } from './ConfirmationPopup';

type DismissiblePopupType = {
  title: string;
  messages: string[];
  onClose: (...args: any) => void;
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
  // if key is not true then show modal.
  const userStorageValueVisible = useMemo(
    () => Boolean(userLocalStorage.getDataByKey(storageKey)),
    [storageKey],
  );
  let isShow = visible && !userStorageValueVisible;

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
