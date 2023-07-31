import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import InfoIcon from 'components/Icons/InfoIcon';
import InformationalPopup from 'components/InformationalPopup';
import { useQuery } from '@apollo/react-hooks';
import { GET_VERSIONS } from 'api/apollo/queries';
import { PlaygroundInfo } from 'api/apollo/generated/graphql';
import { useProject } from 'providers/Project/projectHooks';
import packageJson from '../../package.json';

type PackageJson = {
  dependencies: {
    [key: string]: string;
  };
};

const infoShowVersionModalProps = {
  title: `Playground Versions`,
  messages: [
    `Playground Version: Unknown`,
    `Cadence Version: Unknown`,
    `Emulator Version: Unknown`,
    `Language Server: Unknown`,
  ],
};

const VersionInfoPopup = () => {
  const { setApplicationErrorMessage } = useProject();
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [infoShowVersionModal, setInfoShowVersionModal] = useState({
    ...infoShowVersionModalProps,
  });

  const { loading, error, data } = useQuery<{
    playgroundInfo: PlaygroundInfo;
  }>(GET_VERSIONS, {
    skip: !showVersionModal,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    setApplicationErrorMessage(`Could not get playground dependency versions`);
  }

  useEffect(() => {
    if (!loading && !error && data?.playgroundInfo) {
      const langServerVersion = (packageJson as PackageJson)?.dependencies?.[
        '@onflow/cadence-language-server'
      ];
      const versions = data?.playgroundInfo;
      infoShowVersionModal.messages = [
        `Playground Version: ${versions?.apiVersion || 'Unknown'}`,
        `Cadence Version: ${versions?.cadenceVersion || 'Unknown'}`,
        `Emulator Version: ${versions?.emulatorVersion || 'Unknown'}`,
        `Language Server: ${langServerVersion || 'Unknown'}`,
      ];
      setInfoShowVersionModal({ ...infoShowVersionModal });
    }
  }, [loading]);

  return (
    <>
      <Button
        sx={{ width: 'unset' }}
        onClick={() => setShowVersionModal(true)}
        variant="secondary"
        size="sm"
      >
        <InfoIcon />
      </Button>
      <InformationalPopup
        onClose={() => setShowVersionModal(false)}
        visible={showVersionModal}
        {...infoShowVersionModal}
      />
    </>
  );
};

export default VersionInfoPopup;
