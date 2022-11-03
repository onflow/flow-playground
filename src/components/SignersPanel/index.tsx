import { useProject } from 'providers/Project/projectHooks';
import React, { useState, useMemo } from 'react';
import theme from '../../theme';
import { CollapseButton } from './CollapseButton';
import { SignerPicker } from './SignerPicker';
import AccountPicker from 'components/AccountPicker';
import {
  FaArrowCircleRight,
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Flex, Text } from 'theme-ui';
import {
  Badge,
  Controls,
  ErrorIndex,
  ErrorMessage,
  Heading,
  List,
  SignersContainer,
  SignersError,
  SingleError,
  Title,
} from '../Arguments/styles';
import { Account } from 'api/apollo/generated/graphql';

type SignersProps = {
  maxSelection?: number;
  selected: number[];
  updateSelectedAccounts: (selection: number[]) => void;
};

const defaultHeader = (max: number) => `Choose ${max} Signers`;

const displayAddress = ({ address }: { address: string }) => {
  return `0x${address.slice(-2)}`;
}

const PanelHeader = (maxSelection: number, accounts: Account[], selected: number[] = []) => {
  let message = ""
  let isDefault = false;
  const needSigners = selected.length < maxSelection;

  console.log('selected.length === 1 && selected.includes(1)', selected, selected.length === 1, selected.includes(1))
  if (needSigners) {
    message = `${selected.length} of ${maxSelection} Signers`;
  } else if (selected.length === 0) {
    message = defaultHeader(maxSelection);
  } else if (selected.length === 1 && selected.includes(0)) {
    message = `${displayAddress(accounts[0])} - `
    isDefault = true;
  } else if (selected.length < 3) {
    message = `${selected.map(id => displayAddress(accounts[id])).join(",")} Selected`;
  } else {
    message = `${selected.length} Selected`;
  }

  return (
    <Flex sx={{ justifyContent: "flex-start" }}>
      <Text>{message}</Text>{isDefault ? <Text sx={{ color: theme.colors.blue }}>Default</Text> : null}
    </Flex>
  )
}

export const SignersPanel: React.FC<SignersProps> = ({ maxSelection, selected, updateSelectedAccounts }) => {
  const { project } = useProject();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const { accounts } = project;

  const HeaderText = useMemo(() => PanelHeader(maxSelection, accounts, selected), [maxSelection, accounts, selected])

  return (
    <SignersContainer>
      <Flex sx={{ justifyContent: "space-between" }} onClick={() => setIsAvatarOpen(!isAvatarOpen)}>
        {HeaderText}<CollapseButton isOpen={isAvatarOpen} />
      </Flex>
      {(isAvatarOpen || selected.length === 0) && (
        <AccountPicker
          project={project}
          accounts={accounts}
          selected={selected}
          onChange={updateSelectedAccounts}
          maxSelection={maxSelection}
        />)
      }
    </SignersContainer>
  );
};

