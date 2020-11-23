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
          deleteTransactionTemplate(templateId);
          setActive(EntityType.TransactionTemplate, 0 );
        }}
        onInsert={async () => {
          await mutator.createTransactionTemplate("", `New Transaction`)
          setActive(EntityType.TransactionTemplate, project.transactionTemplates.length);
        }}
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
          deleteScriptTemplate(templateId);
          setActive(EntityType.ScriptTemplate, 0);
        }}
        onInsert={async () => {
          await mutator.createScriptTemplate("", `New Script`);
          setActive(EntityType.ScriptTemplate, project.scriptTemplates.length);
        }}
      />
    </SidebarRoot>
  );
};

export default Sidebar;
