import React from "react";
import { Redirect } from "@reach/router";
import { ProjectProvider } from "providers/Project";
import { Base } from "layout/Base"

import EditorLayout from "./layout";
import { isUUUID, getParams } from "../../util/uuid";

const scriptTypes = ["account", "transaction", "script"]

// const Project: React.FC<ProjectProps> = props => {
const Project: any = (props: any) => {
  const params = getParams(props.location.search)
  // const root = props.location.origin;
  const { projectId } = props;

  const isLocalProject = projectId === "local";
  const correctUUID = isUUUID(projectId);

  const wrongProjectUUID = !correctUUID && !isLocalProject
  const correctProject = !isLocalProject && correctUUID;

  const correctScriptType = scriptTypes.includes(params.type)

  if (wrongProjectUUID){
    return <Redirect noThrow={true} to={"/"}/>
  }

  if (correctProject && !correctScriptType){
    const to = `/${projectId}?type=account&id=0`
    return <Redirect noThrow={true} to={to}/>
  }

  return (
    <Base>
      <ProjectProvider urlProjectId={isLocalProject ? null : projectId}>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Project;
