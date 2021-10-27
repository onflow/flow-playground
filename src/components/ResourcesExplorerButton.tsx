import React from 'react';
import {navigate, useLocation} from "@reach/router";
import { FaDatabase } from 'react-icons/fa';
import { SidebarItemToggleResources } from 'layout/SidebarItemToggleResources';
import { useProject } from 'providers/Project/projectHooks';
import {isUUUID, getParams} from "../util/url";

type ResourcesExplorerButtonProps = {
  addr: string;
};

export const ResourcesExplorerButton = (props: ResourcesExplorerButtonProps) => {
  const { project, setSelectedResourceAccount } = useProject();
  const { addr } = props;

  const projectPath = isUUUID(project.id) ? project.id : "local";

  const location = useLocation();
  const params = getParams(location.search);
  const { type, id, storage } = params;  

  return (
    <SidebarItemToggleResources
      onClick={() => {
        if (addr === storage) {
          setSelectedResourceAccount('none');
          navigate(`/${projectPath}?type=${type}&id=${id}&storage=${'none'}`);
        } else {
          setSelectedResourceAccount(addr);
          navigate(`/${projectPath}?type=${type}&id=${id}&storage=${addr}`);
        }
      }}
      title={'Open the resources explorer'}
      active={addr === storage}
    >
      <FaDatabase />
    </SidebarItemToggleResources>
  );
};
