import Button from 'components/Button';
import LinkIcon from 'components/Icons/LinkIcon';
import AnchorIcon from 'components/Icons/AnchorIcon';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import useClipboard from 'react-use-clipboard';
import Mixpanel from 'util/mixpanel';
import { ShareMenu } from './ShareMenu';
import { Flex } from 'theme-ui';

const ShareLinkButton = () => {
  const url = window.location.href;
  const [isCopied, setCopied] = useClipboard(url, { successDuration: 2000 });

  const onClick = () => {
    setCopied();
    Mixpanel.track('Share link copied', { url });
  };

  return (
    <Button onClick={onClick} variant="alternate" size="sm">
      {!isCopied ? 'Share' : 'Link Copied!'}
      <LinkIcon />
    </Button>
  );
};

const ShareButton = () => {
  const { project, updateProject } = useProject();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const hasParent = !!project.parentId;
  if (!hasParent) {
    updateProject(project.title, project.description, project.readme);
  }

  return (
    <Flex>
      <Button
        onClick={() => {setIsShareMenuOpen(true)}}
        variant="alternate"
        size="sm"
        inline={true}
      >
        Share
        <AnchorIcon/>
      </Button>
      <ShareMenu/>
    </Flex>
  );
};

export default ShareButton;
