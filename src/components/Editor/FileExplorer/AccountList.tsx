import React, { useState } from 'react';
import { navigate, useLocation } from '@reach/router';
import { Account } from 'api/apollo/generated/graphql';
import { EntityType } from 'providers/Project';
import { SidebarItem as Item } from 'layout/SidebarItem';
import { useProject } from 'providers/Project/projectHooks';
import Avatar from 'components/Avatar';
import styled from '@emotion/styled';
import { ExportButton } from 'components/ExportButton';
import { getParams, isUUUID, LOCAL_PROJECT_ID } from '../../../util/url';
import { Box, Flex, Text } from 'theme-ui';
import { SXStyles } from 'src/types';
import Button from 'components/Button';
import ExplorerPlusIcon from 'components/Icons/ExplorerPlusIcon';
import theme from '../../../theme';

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '14px',
    letterSpacing: '-0.01em',
    textTransform: 'uppercase',
    color: '#69717E',
    justifyContent: 'space-between'
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

  },
  button: {
    padding: 'none',
    color: theme.colors.grey,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '16px',
    height: '16px',
  },
  accountCard: {},
  accountTitle: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: '3px',
  },
  avatar: {
    marginRight: '1rem',
    width: '35px',
    height: '35px',
    borderRadius: '0 0 20px 20px',
  }
};

function getDeployedContracts(account: Account): string {
  const contracts = account.deployedContracts.map(
    (contract) => contract.split('.').slice(-1)[0],
  );
  return contracts.join(', ');
}

export const AccountCard = styled.div`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
`;

const AccountList: React.FC = () => {
  const { project, active, setSelectedResourceAccount } = useProject();
  const accountSelected = active.type === EntityType.Account;

  const location = useLocation();
  const params = getParams(location.search);
  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;
  const [isInserting, setIsInserting] = useState(false);


  return (
    <Flex sx={styles.root} >
      <Flex sx={styles.header}>
        <Flex sx={styles.headerTitle}>
          Accounts
        </Flex>
          <Button
            disabled={isInserting}
            variant="secondary"
            onClick={async () => {
              setIsInserting(true);
              try {
                // insert account
              } catch {
                setIsInserting(false);
              }
              setIsInserting(false);
            }}
          >
            <ExplorerPlusIcon />
          </Button>

      </Flex>
      <Box data-test="account-list">
        {project.accounts.map((account: Account, i: number) => {
          const { id } = account;
          const isActive = accountSelected && params.id === id;
          const rawAddress = account.address.slice(-2);
          const accountAddress = rawAddress == '01' ? `0x${rawAddress} - Default` : `0x${rawAddress}`;
          const contractName = getDeployedContracts(account);
          const title = contractName
            ? `${contractName} is deployed to this account`
            : `This account don't have any contracts`;
          const typeName = account.__typename;

          let queryParams = params.type ? `&type=${params.type}` : '';
          queryParams += params.id ? `&id=${params.id}` : '';
          if (params.storage) {
            queryParams +=
              params.storage === accountAddress ? '&storage=none' : `&storage=${accountAddress}`;
          }
      
          queryParams = queryParams.replace('&', '?');

          return (
            <Item title={title} active={isActive} key={account.address}>
              <AccountCard
                onClick={() => {
                  if (accountAddress === params.storage) {
                    setSelectedResourceAccount('none');
                  } else {
                    setSelectedResourceAccount(accountAddress);
                  }
                  navigate(`/${projectPath}${queryParams}`);
                }}
              >
                <Avatar seed={project.seed} index={i} />
                <Flex sx={styles.accountTitle}>
                  <strong>{accountAddress}</strong>
                  <small>{contractName || '--'}</small>
                </Flex>
                {isActive && (
                  <ExportButton id={account.id} typeName={typeName} />
                )}
              </AccountCard>
            </Item>
          );
        })}
      </Box>
    </Flex>
  );
};

export default AccountList;
