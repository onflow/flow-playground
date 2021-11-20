import React from "react";
import {navigate, useLocation} from "@reach/router"
import {Account} from "api/apollo/generated/graphql";
import {EntityType} from "providers/Project";
import {SidebarSection as Root} from "layout/SidebarSection";
import {SidebarHeader as Header} from "layout/SidebarHeader";
import {SidebarItems as Items} from "layout/SidebarItems";
import {SidebarItem as Item} from "layout/SidebarItem";
import {Stack} from "layout/Stack";
import {useProject} from "providers/Project/projectHooks";
import Avatar from "components/Avatar";
import styled from "@emotion/styled";
import {getParams, isUUUID} from "../util/url";

function getDeployedContracts(account: Account): string {
  const contracts = account.deployedContracts.map(
    contract => contract.split(".").slice(-1)[0]
  );
  return "("+ contracts.length +") contracts ... "+ contracts.join(", ");
}

export const AccountCard = styled.div`
  display: flex;
  align-items: flex-end;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: 100%;
`;

const AccountList: React.FC = () => {
  const {
    project,
    active,
  } = useProject();
  const accountSelected = active.type === EntityType.Account

  const location = useLocation();
  const params = getParams(location.search)
  const projectPath = isUUUID(project.id) ? project.id : "local"

  return (
    <Root>
      <Header>Accounts</Header>
      <Items>
        {project.accounts.map((account: Account, i: number) => {
          const { id } = account
          const isActive = accountSelected && params.id === id
          const accountAddress = `0x${account.address.slice(-2)}`
          const contractName = getDeployedContracts(account)
          const title = contractName
            ? `${contractName} is deployed to this account`
            : `This account don't have any contracts`
          return (
            <Item
              key={id}
              title={title}
              active={isActive}
              onClick={() => navigate(`/${projectPath}?type=account&id=${id}`)}
            >
              <AccountCard>
                <Avatar seed={project.seed} index={i} />
                <Stack>
                  <strong>{accountAddress}</strong>
                  <small>{contractName || '--'}</small>
                </Stack>
              </AccountCard>
            </Item>
          );
        })}
      </Items>
    </Root>
  );
};

export default AccountList;
