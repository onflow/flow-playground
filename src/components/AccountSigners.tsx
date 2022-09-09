import { AccountAvatar, AvatarList } from 'components/AccountAvatars';
import Avatar from 'components/Avatar';
import { motion } from 'framer-motion';
import React from 'react';
import { Account, Project } from 'src/api/apollo/generated/graphql';
import { Badge, Flex, Text, useThemeUI } from 'theme-ui';

export const Outline: React.FC = ({ children }) => {
  const { theme } = useThemeUI();

  return (
    <motion.div>
      <Flex
        mx="0.5rem"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '35px',
          width: '35px',
          borderRadius: '50%',
          border: `2px dashed ${theme.colors.greyBorder}`,
        }}
      >
        {children}
      </Flex>
    </motion.div>
  );
};

const AccountSigners: React.FC<{
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
    maxSelection,
  } = props;
  if (!multi) {
    throw new Error('Must include multi prop.');
  }

  const { theme } = useThemeUI();
  const amount = maxSelection || project.accounts.length;
  const renderOutlines = () => {
    const outlines = [];
    for (let i = selectedAccounts.length; i < amount; i++) {
      outlines.push(
        <Outline key={i + 1}>
          <Text
            sx={{
              fontSize: 4,
              color: theme.colors.greyBorder,
            }}
          >
            {i + 1}
          </Text>
        </Outline>,
      );
    }
    return outlines;
  };

  return (
    <AvatarList>
      {selectedAccounts.map((i: number) => {
        const account = accounts[i];
        return (
          <motion.div key={account.address}>
            <AccountAvatar
              key={account.id}
              onClick={() => {
                onChange(i);
              }}
              active={true}
            >
              <motion.div
                style={{
                  cursor: 'pointer',
                  borderRadius: '50%',
                  boxShadow: `0px 0px 0px 3px ${theme.colors.primary}`,
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
                    borderRadius: '0 0 20px 20px',
                  }}
                />
                <Badge
                  px="5px"
                  sx={{
                    fontSize: 3,
                    backgroundColor: theme.colors.primary,
                    position: 'absolute',
                    left: '-2px',
                    bottom: '-1px',
                  }}
                >
                  0x{account.address.slice(-2)}
                </Badge>
              </motion.div>
            </AccountAvatar>
          </motion.div>
        );
      })}
      {renderOutlines()}
    </AvatarList>
  );
};

export default AccountSigners;
