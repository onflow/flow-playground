import { useProject } from 'providers/Project/projectHooks';
import React, { useState, useMemo, useEffect } from 'react';
import theme from '../../../../../theme';
import AccountPicker from './AccountPicker';
import { Flex, Text } from 'theme-ui';
import { SXStyles } from 'src/types';
import { SignersContainer } from '../Arguments/styles';
import Avatar from 'components/Avatar';
import CollapseOpenIcon from 'components/Icons/CollapseOpenIcon';
import Button from 'components/Button';

type SignersProps = {
  maxSelection?: number;
  selectedAccounts: number[];
  updateSelectedAccounts: (selection: number[]) => void;
};

const AvatarIcon = (seed: number, index: number) => {
  return (
    <Avatar
      seed={seed}
      key={index}
      index={index}
      style={{
        width: '17px',
        height: '17px',
        display: 'block',
      }}
    />
  );
};

const AvatarIconList = (seed: number, indexes: number[]) => {
  return (
    <Flex>
      {indexes.map((index) => {
        return AvatarIcon(seed, index);
      })}
    </Flex>
  );
};

const PanelHeader = (
  maxSelection: number,
  seed: number,
  selectedAccounts: number[] = [],
) => {
  let message = '';
  const correctNumSigners = selectedAccounts.length === maxSelection;
  const SIGNERSSELECTED = 'Signers Selected';
  if (correctNumSigners && selectedAccounts.length === 1) {
    message = `${selectedAccounts.length} ${SIGNERSSELECTED}`;
  } else if (correctNumSigners) {
    message = `${selectedAccounts.length} of ${maxSelection} Signers`;
  } else {
    message = `${selectedAccounts.length} of ${maxSelection} ${SIGNERSSELECTED}`;
  }

  return (
    <Flex sx={{ justifyContent: 'flex-start', padding: ' 0.875rem' }}>
      {AvatarIconList(seed, selectedAccounts)}
      <Text sx={{ marginLeft: '0.25rem', fontSize: '14px' }}>{message}</Text>
    </Flex>
  );
};

const styles: SXStyles = {
  root: {
    backgroundColor: theme.colors.white,
    width: '3rem',
  },
  carrotDown: {
    backgroundColor: theme.colors.white,
    transform: 'rotate(180deg)',
    width: '3rem',
  },
};

export const SignersPanel: React.FC<SignersProps> = ({
  maxSelection,
  selectedAccounts,
  updateSelectedAccounts,
}) => {
  const { project } = useProject();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const { accounts } = project;

  const HeaderText = useMemo(
    () => PanelHeader(maxSelection, project.seed, selectedAccounts),
    [maxSelection, selectedAccounts, project.seed],
  );

  useEffect(() => {
    if (selectedAccounts.length === 0 && maxSelection > 0) {
      updateSelectedAccounts([0]); // select first signer as default
    }
  }, [maxSelection, selectedAccounts, updateSelectedAccounts]);

  return (
    <SignersContainer>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {HeaderText}
        <Button
          variant="explorer"
          sx={isAvatarOpen ? styles.carrotDown : styles.root}
          size="sm"
          onClick={() => setIsAvatarOpen(!isAvatarOpen)}
        >
          {CollapseOpenIcon()}
        </Button>
      </Flex>
      {(isAvatarOpen || selectedAccounts.length === 0) && (
        <AccountPicker
          project={project}
          accounts={accounts}
          selectedAccounts={selectedAccounts}
          onChange={updateSelectedAccounts}
          maxSelection={maxSelection}
        />
      )}
    </SignersContainer>
  );
};
