import Avatar from 'components/Avatar';
import { motion } from 'framer-motion';
import React from 'react';
import { Account, Project } from 'src/api/apollo/generated/graphql';
import theme from '../theme';
import { ChildProps } from 'src/types';
import { Text, Badge, Box, Flex, useThemeUI } from 'theme-ui';

interface AccountAvatarProps extends ChildProps {
  onClick: (e: any, i: number) => void;
  isSelected: boolean;
}

export const AccountAvatar = ({ children, onClick, isSelected }: AccountAvatarProps) => {
  return (
    <motion.div>
      <Box
        // @ts-expect-error #TODO: switch to button
        onClick={onClick}
        mx="0.25rem"
        sx={{
          borderRadius: '0.5rem',
          border: '1px solid',
          padding: '0.25rem 0.5rem 0.75px',
          margin: '0',
          borderColor: isSelected
            ? theme.colors.avatarSelectedColor
            : theme.colors.avatarNotSelectedColor,
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export const AvatarList = ({ children }: ChildProps) => {
  return (
    <Flex
      sx={{
        flex: '1 1 auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'scroll'
      }}
    >
      {children}
    </Flex>
  );
};

const noop = (): void => { };

const AccountAvatars: React.FC<{
  multi?: boolean;
  selectedAccounts: number[];
  onChange: (selected: number) => void;
  project: Project;
  accounts: Account[];
  maxSelection?: number;
}> = (props) => {
  const {
    multi,
    selectedAccounts,
    accounts,
    project,
    onChange,
  } = props;
  if (!multi) {
    throw new Error('Must include multi prop.');
  }

  const { theme } = useThemeUI();
  return (
    <AvatarList>
      {accounts.map((account: Account, i: number) => {
        const isSelected =
          selectedAccounts.includes(i);
        return (
          <motion.div key={account.address}>
            <AccountAvatar
              key={account.id}
              onClick={() => onChange(i)}
              isSelected={isSelected}
            >
              <motion.div
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Avatar
                  seed={project.seed}
                  index={i}
                  style={{
                    width: '35px',
                    height: '35px',
                    display: 'block',
                    borderRadius: '0 0 20px 20px'
                  }}
                />
                <Text
                  px="5px"
                  sx={{
                    fontSize: "0.75rem",
                    color: isSelected
                      ? theme.colors.avatarSelectedColor
                      : theme.colors.avatarTextColor,
                  }}
                >
                  0x{account.address.slice(-2)}
                </Text>
              </motion.div>
            </AccountAvatar>
          </motion.div>
        );
      })}
    </AvatarList>
  );
};

export default AccountAvatars;
