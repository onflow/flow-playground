// import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { Redirect, navigate } from "@reach/router";
import { useApolloClient } from '@apollo/react-hooks';
import { ProjectProvider } from "providers/Project";
import { Base } from "layout/Base"
import { useGetActiveProjectQuery } from "api/apollo/generated/graphql";
import useGetProject from '../../providers/Project/projectHooks';
import { EntityType } from "providers/Project";

import EditorLayout from "./layout";
import { isUUUID, getParams, scriptTypes } from "../../util/url";

const Playground: any = (props: any) => {
  // console.log("PLAYGORUND RAN!!!");
  // console.log("PROPS:", props);
  
  
  const params = getParams(props.location.search)
  const { type, id } = params;
  const { projectId } = props;
  console.log("PROJECT ID FROM INDEX:", projectId);
  

  const isLocalProject = projectId === "LOCAL-project";
  const correctUUID = isUUUID(projectId);

  const wrongProjectUUID = !correctUUID && !isLocalProject
  // console.log("WRONG UUID:", wrongProjectUUID);
  
  const correctProject = !isLocalProject && correctUUID;

  const correctScriptType = scriptTypes.includes(params.type)

  // if (wrongProjectUUID){
  //   return <Redirect noThrow={true} to={"/"}/>
  // }

  // if (correctProject && !correctScriptType){
  //   const to = `/${projectId}?type=account&id=0`
  //   return <Redirect noThrow={true} to={to}/>
  // }

  const { data: freshProject } = useGetActiveProjectQuery()
  const isActiveProject = freshProject.activeProject

  const client = useApolloClient();
  const foundProjectId = correctUUID ? projectId : null
  const {
    project: project,
    // isLocal: isLocal,
    // isLoading: isLoading,
  } = useGetProject(client, foundProjectId, isActiveProject);
  
  // console.log("IS LOCAL:", isLocal);
  // console.log("IS LOADING:", isLoading);

  // const [active, setActive] = useState<{ type: EntityType; index: number }>({
  //   type: EntityType.Account,
  //   index: 0,
  // });

  const [active, setActive] = useState<{ type: EntityType; index: number }>({
    type: EntityType.Account,
    index: 0,
  });


  useEffect(() => {
    // project && console.log("PROJECT!!!:", project);

    if (project) {

      let activeType
      if (type == '' || type === undefined || !scriptTypes.includes(type)) {
        activeType = 'account'
      } else {
        activeType = type
      }
      // console.log("FINAL LOAD TYPE:", activeType);

      // console.log("ID:", id);
      
      
      let templateId;
      if (id == '' || id === undefined) {
        // console.log("id was empty or undefined (cont)");
        switch (activeType) {
          case 'tx':
            setActive({
              type: EntityType.TransactionTemplate,
              index: 0,
            });
            templateId = project.transactionTemplates[0].id;
            break;
          case 'script':
            setActive({
              type: EntityType.ScriptTemplate,
              index: 0,
            });
            templateId = project.scriptTemplates[0].id;
            break;
          case 'account':
          default:
            setActive({
              type: EntityType.Account,
              index: 0,
            });
            templateId = project.accounts[0].id;
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
              templateId = project.transactionTemplates[foundIndex].id;
            } else {
              templateId = project.transactionTemplates[0].id;
            }
            setActive({
              type: EntityType.TransactionTemplate,
              index: foundIndex,
            });
            break;
          case 'script':
            foundIndex = project.scriptTemplates.findIndex(
              (template: { id: string; }) => template.id === id,
            );
            if (foundIndex > 0) {
              templateId = project.scriptTemplates[foundIndex].id;
            } else {
              templateId = project.scriptTemplates[0].id;
            }
            setActive({
              type: EntityType.ScriptTemplate,
              index: foundIndex,
            });
            break;
          case 'account':
          default:
            foundIndex = project.accounts.findIndex(
              (template: { id: string; }) => template.id === id,
            );
            if (foundIndex > 0) {
              templateId = project.accounts[foundIndex].id;
            } else {
              templateId = project.accounts[0].id;
            }
            setActive({
              type: EntityType.Account,
              index: foundIndex,
            });
            break;
        }
      }
      // console.log("TEMPLATE ID:", templateId);

      // navigate(`/${project.id}?type=${activeType}&id=${templateId}`)

      console.log("PROJECT ID:", projectId);
      

      if (projectId !== "LOCAL-project") {
        // navigate(`/${project.id}?type=${activeType}&id=${templateId}`)

      }
      if (project && activeType && templateId) {
        // navigate(`/${project.id}?type=${activeType}&id=${templateId}`)
        // console.log("PROJECT:", project);
        // console.log("ACTIVE TYPE:", activeType);
        // console.log("TEMPLATE ID:", templateId);
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
