import { Account, Project } from 'api/apollo/generated/graphql';
import AccountAvatars from 'components/AccountAvatars';
import React, { useEffect } from 'react';
import { ChildPropsOptional } from 'src/types';
import { Flex } from 'theme-ui';

interface AccountPickerProps extends ChildPropsOptional {
  project: Project;
  accounts: Account[];
  selectedAccounts: number[];
  onChange: (selectedAccounts: number[]) => void;
  maxSelection?: number;
}

const AccountPicker = ({
  project,
  accounts,
  selectedAccounts,
  onChange,
  maxSelection = 4,
}: AccountPickerProps) => {
  const handleOnChange = (i: number, max: number) => {
    if (max === 1) {
      // behave like radio button
      onChange([i]);
    } else if (selectedAccounts.includes(i)) {
      onChange(selectedAccounts.filter((j: any) => j !== i));
    } else {
      onChange([...selectedAccounts, i]);
    }
  };

  useEffect(() => {
    if (!selectedAccounts.length) {
      onChange([0]);
    }
    if (selectedAccounts.length > maxSelection) {
      onChange(selectedAccounts.slice(0, maxSelection));
    }
  }, [maxSelection]);

  return (
    <Flex
      my={1}
      sx={{
        padding: '0 0.5rem 0.5rem 0.5rem',
        alignItems: 'flex-start',
      }}
    >
      <AccountAvatars
        multi={true}
        project={project}
        accounts={accounts}
        selectedAccounts={selectedAccounts}
        onChange={(index: number) => handleOnChange(index, maxSelection)}
        maxSelection={maxSelection}
      />
    </Flex>
  );
};

export default AccountPicker;
