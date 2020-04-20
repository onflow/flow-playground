import React from "react";
import { Account } from "api/apollo/generated/graphql";
import { EntityType } from "providers/Project";
import { SidebarSection as Root } from "layout/SidebarSection";
import { SidebarHeader as Header } from "layout/SidebarHeader";
import { SidebarItems as Items } from "layout/SidebarItems";
import { SidebarItem as Item } from "layout/SidebarItem";
import { Stack } from "layout/Stack";
import { useProject } from "providers/Project/projectHooks";
import Avatar from "components/Avatar";

function getDeployedContracts(account: Account): string {
  const contracts = account.deployedContracts.map(
    contract => contract.split(".").slice(-1)[0]
  );
  return contracts.join(", ");
}

import styled from "@emotion/styled";

export const AccountCard = styled.div`
  display: flex;
  align-items: flex-end;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const AccountList: React.FC = () => {
  const {
    project,
    active: rawActive,
    setActive
  } = useProject();
  const active = rawActive.type === EntityType.Account ? rawActive.index : null;
  return (
    <Root>
      <Header>Accounts</Header>
      <Items>
        {project.accounts.map((account: Account, i: number) => {
          return (
            <Item
              key={i}
              active={active === i}
              onClick={() => setActive(EntityType.Account, i)}
            >
              <AccountCard>
                <Avatar seed={project.seed} index={i} />
                <Stack>
                  <strong>0x{account.address.slice(-2)}</strong>
                  <small>{getDeployedContracts(account) || "--"}</small>
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
