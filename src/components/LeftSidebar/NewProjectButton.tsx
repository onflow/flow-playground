import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import useProjects from '../../hooks/useProjects';
import Button, { ButtonProps } from '../Button';
import PlusIcon from '../Icons/PlusIcon';
import Tooltip from '../Tooltip';

export const MAX_PROJECTS = 20;

type NewProjectButtonProps = {
  label?: string;
  delayTooltipShow?: number;
} & Pick<ButtonProps, 'size' | 'variant' | 'inline'>;

const NewProjectButton = ({
  label,
  size,
  variant,
  inline,
  delayTooltipShow,
}: NewProjectButtonProps) => {
  const { projects } = useProjects();
  const { createBlankProject, isSaving } = useProject();
  const hasReachedProjectsLimit = projects.length > MAX_PROJECTS;
  return (
    <>
      <Tooltip
        label={`You can only have a maximum of ${MAX_PROJECTS} projects.`}
        disabled={!hasReachedProjectsLimit}
        delayShow={delayTooltipShow}
      >
        <Button
          onClick={createBlankProject}
          variant={hasReachedProjectsLimit ? 'disabled' : variant}
          size={size}
          disabled={isSaving || hasReachedProjectsLimit}
          hideDisabledState={isSaving && !hasReachedProjectsLimit}
          inline={inline}
        >
          <PlusIcon />
          {label}
        </Button>
      </Tooltip>
    </>
  );
};

export default NewProjectButton;
