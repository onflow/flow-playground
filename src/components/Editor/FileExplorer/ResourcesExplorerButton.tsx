import { navigate, useLocation } from '@reach/router';
import { SidebarItemToggleResources } from 'layout/SidebarItemToggleResources';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { FaDatabase } from 'react-icons/fa';
import { getParams, isUUUID, LOCAL_PROJECT_ID } from 'util/url';

type ResourcesExplorerButtonProps = {
  address: string;
};

export const ResourcesExplorerButton = (
  props: ResourcesExplorerButtonProps,
) => {
  const { project, setSelectedResourceAccount } = useProject();
  const { address } = props;

  const projectPath = isUUUID(project.id) ? project.id : LOCAL_PROJECT_ID;

  const location = useLocation();
  const params = getParams(location.search);
  const { type, id, storage } = params;

  let queryParams = type ? `&type=${type}` : '';
  queryParams += id ? `&id=${id}` : '';
  if (storage) {
    queryParams +=
      storage === address ? '&storage=none' : `&storage=${address}`;
  }

  queryParams = queryParams.replace('&', '?');

  return (
    <SidebarItemToggleResources
      onClick={() => {
        if (address === storage) {
          setSelectedResourceAccount('none');
        } else {
          setSelectedResourceAccount(address);
        }
        navigate(`/${projectPath}${queryParams}`);
      }}
      title="Open the resources explorer"
      active={address === storage}
    >
      <FaDatabase />
    </SidebarItemToggleResources>
  );
};
