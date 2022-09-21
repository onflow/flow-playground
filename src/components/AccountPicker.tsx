import { Account, Project } from 'api/apollo/generated/graphql';
import AccountAvatars from 'components/AccountAvatars';
import AccountSigners from 'components/AccountSigners';
import React, { useEffect } from 'react';
import { Flex, useThemeUI } from 'theme-ui';

type AccountPickerProps = {
  project: Project;
  accounts: Account[];
  selected: number[];
  onChange: (selected: number[]) => void;
  maxSelection?: number;
  children?: React.ReactNode;
};

const AccountPicker = ({
  project,
  accounts,
  selected,
  onChange,
  maxSelection = 4,
  children,
}: AccountPickerProps) => {
  const { theme } = useThemeUI();
  const handleOnChange = (i: number) => {
    if (selected.includes(i)) {
      onChange(selected.filter((j: any) => j !== i));
    } else {
      onChange([...selected, i]);
    }
  };

  useEffect(() => {
    if (!selected.length) {
      onChange([0]);
    }
    if (selected.length > maxSelection) {
      onChange(selected.slice(0, maxSelection));
    }
  }, [maxSelection]);

  return (
    <Flex
      sx={{
        flexDirection: 'column',
      }}
    >
      <Flex
        my={1}
        sx={{
          padding: '0.8rem 0.5rem',
          alignItems: 'center',
          border: `1px solid ${theme.colors.borderDark}`,
          backgroundColor: theme.colors.background,
          borderRadius: '50px',
        }}
      >
        <AccountAvatars
          multi={true}
          project={project}
          accounts={accounts}
          selectedAccounts={selected}
          onChange={handleOnChange}
          maxSelection={maxSelection}
        />
      </Flex>
      <Flex
        sx={{
          padding: '0.8rem 0.5rem',
          alignItems: 'center',
          border: `1px solid ${theme.colors.borderDark}`,
          backgroundColor: theme.colors.background,
          borderRadius: '8px',
        }}
      >
        <AccountSigners
          multi={true}
          project={project}
          accounts={accounts}
          selectedAccounts={selected.slice(0, maxSelection)}
          onChange={handleOnChange}
          maxSelection={maxSelection}
        />
        <Flex
          px="0.5rem"
          sx={{
            alignItems: 'center',
          }}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AccountPicker;
