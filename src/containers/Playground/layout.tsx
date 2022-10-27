import { useLocation } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getParams } from 'util/url';
import { useProject } from 'providers/Project/projectHooks';
import { decodeText } from 'util/readme';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import Editor from './../../components/Editor/index';

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
};

const PlaygroundLayout: React.FC = () => {
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
    <Flex sx={styles.root}>
      <Helmet>
        <title>Flow - {helmetTitle} </title>
        <meta name="description" content={helmetDescription} />
      </Helmet>
      <Editor isLoading={isLoading} project={project} active={active} />
    </Flex>
  );
};

export default PlaygroundLayout;
