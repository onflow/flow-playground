import React from "react";
import { EntityType } from "providers/Project";
import AccountList from "components/AccountList";
import MenuList from "components/MenuList";
import { Sidebar as SidebarRoot } from "layout/Sidebar";

import { useProject } from "providers/Project/projectHooks";
import { navigate } from "@reach/router";
import { isUUUID } from "../util/url";

const Sidebar: React.FC = () => {
  const {
    isLoading,
    active,
    project,
    mutator,
    deleteTransactionTemplate,
    deleteScriptTemplate,
    updateTransactionTemplate,
    updateScriptTemplate,
    selectedResourceAccount
  } = useProject();

  if (isLoading) return <p>Loading...</p>;

  const projectPath = isUUUID(project.id) ? project.id : "local"

  const storageAcct = selectedResourceAccount || 'none'

  return (
    <SidebarRoot>
      <AccountList />
      <MenuList
        title="Transaction Templates"
        items={project.transactionTemplates}
        active={
          active.type == EntityType.TransactionTemplate ? active.index : null
        }
        onSelect={(_, id) => {
          navigate(`/${projectPath}?type=tx&id=${id}&storage=${storageAcct}`)
        }}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateTransactionTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await deleteTransactionTemplate(templateId);
          const id = project.transactionTemplates[0].id;
          navigate(`/${projectPath}?type=tx&id=${id}&storage=${storageAcct}`)
        }}
        onInsert={async () => {
          const res = await mutator.createTransactionTemplate("", `New Transaction`)
          navigate(`/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${storageAcct}`)
        }}
      />
      <MenuList
        title="Script Templates"
        items={project.scriptTemplates}
        active={active.type == EntityType.ScriptTemplate ? active.index : null}
        onSelect={(_, id) => {
          navigate(`/${projectPath}?type=script&id=${id}&storage=${storageAcct}`)
        }}
        onUpdate={(templateId: string, script: string, title: string) => {
          updateScriptTemplate(templateId, script, title);
        }}
        onDelete={async (templateId: string) => {
          await deleteScriptTemplate(templateId);
          const id = project.scriptTemplates[0].id;
          navigate(`/${projectPath}?type=script&id=${id}&storage=${storageAcct}`)
        }}
        onInsert={async () => {
          const res = await mutator.createScriptTemplate("", `New Script`);
          navigate(`/${projectPath}?type=script&id=${res.data?.createScriptTemplate?.id}&storage=${storageAcct}`)
        }}
      />
    </SidebarRoot>
  );
};

export default Sidebar;
