import Button from 'components/Button';
import AnchorIcon from 'components/Icons/AnchorIcon';
import { useProject } from 'providers/Project/projectHooks';
import React from 'react';
import { FaCloudUploadAlt, FaCodeBranch } from 'react-icons/fa';
import useClipboard from 'react-use-clipboard';
import Mixpanel from 'util/mixpanel';

const ShareButton = () => {
  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });

  const onClick = () => {
    setCopied();
    Mixpanel.track('Share link copied', { url });
  };

  return (
    <Button onClick={onClick} variant="alternate" size="sm">
      {!isCopied ? 'Share' : 'Link Copied!'}
      <AnchorIcon />
    </Button>
  );
};

const ShareSaveButton = () => {
  const { project, isSaving, updateProject } = useProject();
  const hasParent = !!project.parentId;
  const text = hasParent ? 'Fork' : 'Save';
  const onSaveButtonClick = () =>
    updateProject(project.title, project.description, project.readme);

  if (project.persist) return <ShareButton />;

  return (
    <Button
      onClick={onSaveButtonClick}
      variant="alternate"
      disabled={isSaving}
      size="sm"
    >
      {text}
      {hasParent ? <FaCodeBranch /> : <FaCloudUploadAlt />}
    </Button>
  );
};

export default ShareSaveButton;
