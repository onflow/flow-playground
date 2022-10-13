import { useLocation } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getParams } from 'util/url';

import Sidebar from 'components/Sidebar';

import { EditorContainer } from './components';

import TopNav from 'components/TopNav';
import { useProject } from 'providers/Project/projectHooks';
import { decodeText } from 'util/readme';

const EditorLayout: React.FC = () => {
  const { project, isLoading, active, setSelectedResourceAccount } =
    useProject();

  const location = useLocation();
  const params = getParams(location.search);
  useEffect(() => {
    if (params.storage) setSelectedResourceAccount(params.storage);
  }, [params]);

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
      <TopNav />
      <Sidebar />
      <EditorContainer
        isLoading={isLoading}
        project={project}
        active={active}
      />
    </>
  );
};

export default EditorLayout;
