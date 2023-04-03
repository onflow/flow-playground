import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useProject } from 'providers/Project/projectHooks';
import { decodeText } from 'util/readme';
import Editor from '../../components/Editor/index';

type EditorLayoutProps = {
  isExplorerCollapsed: boolean;
  toggleExplorer: () => void;
};

const EditorLayout = ({
  isExplorerCollapsed,
  toggleExplorer,
}: EditorLayoutProps) => {
  const { project, isLoading, active } = useProject();

  const [helmetTitle, setHelmetTitle] = useState(decodeText(project.title));
  const [helmetDescription, setHelmetDescription] = useState(
    decodeText(project.title),
  );

  useEffect(() => {
    if (project.title) {
      const titleDebounce = setTimeout(() => {
        setHelmetTitle(decodeText(project.title));
      }, 3000);
      const descriptionDebounce = setTimeout(() => {
        setHelmetDescription(decodeText(project.description));
      }, 3000);

      return () => {
        clearTimeout(titleDebounce);
        clearTimeout(descriptionDebounce);
      };
    }
  }, [project.title]);

  if (!isLoading && !project) {
    // NOTE: Leave this. 404 redirect is handled in
    // projectHooks.tsx. Show nothing before navigating.
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>Flow - {helmetTitle} </title>
        <meta name="description" content={helmetDescription} />
      </Helmet>
      <Editor
        isExplorerCollapsed={isExplorerCollapsed}
        toggleExplorer={toggleExplorer}
        isLoading={isLoading}
        project={project}
        active={active}
      />
    </>
  );
};

export default EditorLayout;
