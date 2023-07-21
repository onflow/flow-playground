import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import useProjects from '../../hooks/useProjects';
import Button, { ButtonProps } from '../Button';
import PlusIcon from '../Icons/PlusIcon';
import Tooltip from '../Tooltip';

export const MAX_PROJECTS = 10;

type NewProjectButtonProps = {
  label?: string;
  delayTooltipShow?: number;
} & Pick<ButtonProps, 'size' | 'variant' | 'inline'>;

const NewProjectButton = ({
  label,
  size,
  inline,
  delayTooltipShow,
}: NewProjectButtonProps) => {
  const { projects } = useProjects();
  const { createBlankProject, isSaving } = useProject();
  const hasReachedProjectsLimit = projects.length > MAX_PROJECTS;
  return (
    <>
      <Tooltip
        label={`You can have a maximum of ${MAX_PROJECTS} projects.`}
        disabled={!hasReachedProjectsLimit}
        delayShow={delayTooltipShow}
      >
        <Button
          onClick={createBlankProject}
          variant={hasReachedProjectsLimit ? 'disabled' : 'primary'}
          size={size}
          disabled={isSaving || hasReachedProjectsLimit}
          hideDisabledState={isSaving && !hasReachedProjectsLimit}
          inline={inline}
        >
          <PlusIcon primary />
          {label}
        </Button>
      </Tooltip>
    </>
  );
};

export default NewProjectButton;
