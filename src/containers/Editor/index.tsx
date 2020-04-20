import React from "react";
import { RouteComponentProps } from "@reach/router";
import { ProjectProvider } from "providers/Project";
import { Base } from "layout/Base"

import EditorLayout from "./layout";

interface ProjectProps extends RouteComponentProps {
  "*"?: string;
}

function parseProjectId(props: ProjectProps): string | null {
  return props["*"] || null;
}

const Project: React.FC<ProjectProps> = props => {
  const projectId = parseProjectId(props);

  return (
    <Base>
      <ProjectProvider urlProjectId={projectId}>
        <EditorLayout />
      </ProjectProvider>
    </Base>
  );
};

export default Project;
