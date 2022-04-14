import React, { useEffect, useState } from 'react';
import { useProject } from 'providers/Project/projectHooks';

import {
  SingleToast,
  ToastContainer,
  RemoveToastButton,
  ButtonContainer,
  ContentBox,
  Content,
} from './components';
import { AiFillCloseCircle } from 'react-icons/ai';

const Notifications = () => {
  // ===========================================================================
  // GLOBAL HOOKS
  const { project, lastSigners } = useProject();

  // HOOKS  -------------------------------------------------------------------
  const [_, setProjectAccounts] = useState(project.accounts);
  const [counter, setCounter] = useState(0);
  const [notifications, setNotifications] = useState<{
    [identifier: string]: string[];
  }>({});

  // METHODS  -------------------------------------------------------------------
  const removeNotification = (set: any, id: number) => {
    set((prev: any[]) => {
      delete prev[id];
      return {
        ...prev,
      };
    });
  };

  // EFFECTS  -------------------------------------------------------------------
  useEffect(() => {
    setProjectAccounts((prevAccounts) => {
      const latestAccounts = project.accounts;
      const updatedAccounts = latestAccounts.filter(
        (latestAccount, index) =>
          latestAccount.state !== prevAccounts[index].state,
      );

      if (updatedAccounts.length > 0) {
        setNotifications((prev) => {
          return {
            ...prev,
            [counter]: updatedAccounts,
          };
        });
        setTimeout(() => removeNotification(setNotifications, counter), 5000);
        setCounter((prev) => prev + 1);
      }
      return project.accounts;
    });
  }, [project]);

  // VARIABLES AND CONSTANTS  ---------------------------------------------------
  const toasts = Object.keys(notifications).map((id) => {
    const updatedAccounts = notifications[id];
    let updatedStorageAccounts: string[] = [];

    updatedAccounts.forEach((acct: any) => {
      const { address } = acct;
      const accountIndex = address.charAt(address.length - 1);
      const accountHex = `0x0${accountIndex}`;
      updatedStorageAccounts.push(accountHex);
    });

    const shallRender = lastSigners && updatedStorageAccounts;
    if (!shallRender) {
      return null;
    }

    const pluralSigners = lastSigners?.length > 1 ? 'Accounts' : 'Account';
    const pluralUpdated =
      updatedStorageAccounts?.length > 1 ? 'accounts' : 'account';
    const signers = lastSigners.join(', ');
    const updated = updatedStorageAccounts.join(', ');
    const toastText = `${pluralSigners} ${signers} updated the storage in ${pluralUpdated} ${updated}.`;

    const onClick = () => removeNotification(setNotifications, parseInt(id));

    return {
      id,
      toastText,
      onClick,
    };
  });

  // RENDER
  return (
    <ToastContainer>
      <ul>
        {toasts.map((toast) => {
          const { id, toastText, onClick } = toast;

          return (
            <SingleToast key={id}>
              <ButtonContainer>
                <RemoveToastButton onClick={onClick}>
                  <AiFillCloseCircle color="grey" size="32" />
                </RemoveToastButton>
              </ButtonContainer>
              <ContentBox>
                <Content>{toastText}</Content>
              </ContentBox>
            </SingleToast>
          );
        })}
      </ul>
    </ToastContainer>
  );
};

export default Notifications;
