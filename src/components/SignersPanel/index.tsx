import { useProject } from 'providers/Project/projectHooks';
import React, { useState, useMemo } from 'react';
import theme from '../../theme';
import AccountPicker from 'components/AccountPicker';
import { Flex, Text } from 'theme-ui';
import { SXStyles } from 'src/types';
import {
  SignersContainer,
} from '../Arguments/styles';
import { Account } from 'api/apollo/generated/graphql';
import Avatar from 'components/Avatar';
import CollapseOpenIcon from 'components/Icons/CollapseOpenIcon';
import Button from 'components/Button';

type SignersProps = {
  maxSelection?: number;
  selected: number[];
  updateSelectedAccounts: (selection: number[]) => void;
};

const displayAddress = ({ address }: { address: string }) => {
  return `0x${address.slice(-2)}`;
}

const AvatarIcon = (seed: number, index: number, complete: boolean) => {
  return (
    <Avatar
      seed={seed}
      index={index}
      style={{
        width: '17px',
        height: '17px',
        display: 'block',
        borderRadius: '20px',
        border: `1px solid ${complete ? theme.colors.primary : theme.colors.errors}`
      }}
    />)
}

const AvatarIconList = (seed: number, indexes: number[], complete: boolean = false) => {
  return (
    <Flex>
      {indexes.map(index => {
        return AvatarIcon(seed, index, complete);
      })}
    </Flex>
  )
}

const PanelHeader = (maxSelection: number, accounts: Account[], seed: number, selected: number[] = []) => {
  // TODO: accounts might be needed for displaying account addr, to be determined
  let message = ""
  const correctNumSigners = selected.length === maxSelection;
  const signersSelected = "Signers Selected";
  if (correctNumSigners && selected.length === 1) {
    message = `${selected.length} ${signersSelected}`;
  } else if (correctNumSigners) {
    message = `${selected.length} of ${maxSelection} Signers`;
  } else {
    message = `${selected.length} of ${maxSelection} ${signersSelected}`;
  }

  return (
    <Flex sx={{ justifyContent: "flex-start" }}>
      {AvatarIconList(seed, selected, correctNumSigners)}
      <Text sx={{marginLeft: '0.25rem'}}>{message}</Text>
    </Flex>
  )
}

const styles: SXStyles = {   
  root: {
    backgroundColor: theme.colors.white,
    width: '50px'
  },
  carrotDown: {
    backgroundColor: theme.colors.white,
    transform: 'rotate(180deg)',
    width: '50px'
  },
};

export const SignersPanel: React.FC<SignersProps> = ({ maxSelection, selected, updateSelectedAccounts }) => {
  const { project } = useProject();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const { accounts } = project;

  const HeaderText = useMemo(() => PanelHeader(maxSelection, accounts, project.seed, selected), [maxSelection, accounts, selected, project.seed])

  return (
    <SignersContainer>
      <Flex sx={{ justifyContent: "space-between", alignItems: "center" }} onClick={() => setIsAvatarOpen(!isAvatarOpen)}>
        {HeaderText}<Button sx={isAvatarOpen ? styles.carrotDown : styles.root} size="sm" >{CollapseOpenIcon()}</Button>
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

