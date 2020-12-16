import React from "react";
import { EntityType } from "providers/Project";
import AccountList from "components/AccountList";
import MenuList from "components/MenuList";
import { Sidebar as SidebarRoot } from "layout/Sidebar";

import { useProject } from "providers/Project/projectHooks";

const Sidebar: React.FC = () => {
  const {
    isLoading,
    active,
    setActive,
    project,
    mutator,
    deleteTransactionTemplate,
    deleteScriptTemplate,
    updateTransactionTemplate,
    updateScriptTemplate
  } = useProject();

  if (isLoading) return <p>Loading...</p>;

  return (
    <SidebarRoot>
      <AccountList />
      <MenuList
        title="Transaction Templates"
        items={project.transactionTemplates}
        active={
          active.type == EntityType.TransactionTemplate ? active.index : null
        }
        onSelect={(_, index) =>
          setActive(EntityType.TransactionTemplate, index)
        }
        onUpdate={(templateId: string, script: string, title: string) => {
          updateTransactionTemplate(templateId, script, title);
        }}
        onDelete={(templateId: string) => {
          setActive(EntityType.Account, 0);
          deleteTransactionTemplate(templateId);
        }}
        onInsert={() =>
          mutator.createTransactionTemplate(
            "",
            `Transaction ${project.transactionTemplates.length + 1}`
          )
        }
      />
      <MenuList
        title="Script Templates"
        items={project.scriptTemplates}
        active={active.type == EntityType.ScriptTemplate ? active.index : null}
        onSelect={(_, index) => setActive(EntityType.ScriptTemplate, index)}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateScriptTemplate(templateId, script, title);
        }}
        onDelete={(templateId: string) => {
          setActive(EntityType.Account, 0);
          deleteScriptTemplate(templateId);
        }}
        onInsert={() => {
          mutator.createScriptTemplate(
            "",
            `Script ${project.scriptTemplates.length + 1}`
          );
        }}
      />
    </SidebarRoot>
  );
};

export default Sidebar;
