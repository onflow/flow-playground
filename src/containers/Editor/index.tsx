import React, { useEffect, useState } from "react";
import { useApolloClient } from '@apollo/react-hooks';
import { ProjectProvider } from "providers/Project";
import { Base } from "layout/Base"
import { useGetActiveProjectQuery } from "api/apollo/generated/graphql";
import useGetProject from '../../providers/Project/projectHooks';
import { EntityType } from "providers/Project";

import EditorLayout from "./layout";
import { isUUUID, getParams, scriptTypes } from "../../util/url";
import { navigate } from "@reach/router";

const Playground: any = (props: any) => {

  const { projectId } = props;
  
  const params = getParams(props.location.search);
  const { type, id } = params;

  const isLocalProject = projectId === "LOCAL-project";
  const correctUUID = isUUUID(projectId);
  
  const { data } = useGetActiveProjectQuery();
  const isActiveProject = data.activeProject;

  const client = useApolloClient();
  const resolvedProjectId = correctUUID ? projectId : null
  
  const {
    project
  } = useGetProject(client, resolvedProjectId, isActiveProject);
  
  const [active, setActive] = useState<{ type: EntityType; index: number }>({
    type: EntityType.Account,
    index: 0,
  });

  useEffect(() => {
    if (project) {

      let activeType;
      if (type == '' || type === undefined || !scriptTypes.includes(type)) {
        activeType = 'account';
      } else {
        activeType = type;
      };
      
      if (id == '' || id === undefined) {
        switch (activeType) {
          case 'tx':
            setActive({
              type: EntityType.TransactionTemplate,
              index: 0,
            });
            break;
          case 'script':
            setActive({
              type: EntityType.ScriptTemplate,
              index: 0,
            });
            break;
          case 'account':
          default:
            setActive({
              type: EntityType.Account,
              index: 0,
            });
            break;
        }
      } else {
        let foundIndex;
        switch (activeType) {
          case 'tx':
            foundIndex = project.transactionTemplates.findIndex(
              (template: { id: string; }) => template.id === id,
            );
            if (foundIndex > 0) {
              setActive({
                type: EntityType.TransactionTemplate,
                index: foundIndex,
              });
            } else {
              setActive({
                type: EntityType.TransactionTemplate,
                index: 0,
              });
              navigate(`/${projectId}?type=tx&id=${project.transactionTemplates[0].id}`)
            }
            break;
          case 'script':
            foundIndex = project.scriptTemplates.findIndex(
              (template: { id: string; }) => template.id === id,
            );
            if (foundIndex > 0) {
              setActive({
                type: EntityType.ScriptTemplate,
                index: foundIndex,
              });
            } else {
              setActive({
                type: EntityType.ScriptTemplate,
                index: 0,
              });
              navigate(`/${projectId}?type=script&id=${project.scriptTemplates[0].id}`)
            }
            break;
          case 'account':
          default:
            foundIndex = project.accounts.findIndex(
              (template: { id: string; }) => template.id === id,
            );
            if (foundIndex > 0) {
              setActive({
                type: EntityType.Account,
                index: foundIndex,
              });

            } else {
              setActive({
                type: EntityType.Account,
                index: 0,
              });
              navigate(`/${projectId}?type=account&id=${project.accounts[0].id}`)
            }
            break;
        }
      }
    }
  },[project, type, id])

  return (
    <Base>
      <ProjectProvider 
        urlProjectId={isLocalProject ? null : projectId}
        active={active}
        setActive={setActive}
      >
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Playground;
