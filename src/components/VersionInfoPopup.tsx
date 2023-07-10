import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import { SXStyles } from 'src/types';
import theme from '../theme';
import InfoIcon from 'components/Icons/InfoIcon';
import InformationalPopup from 'components/InformationalPopup';
import { useQuery } from '@apollo/react-hooks';
import { GET_VERSIONS } from 'api/apollo/queries';
import { PlaygroundInfo } from 'api/apollo/generated/graphql';
import { useProject } from 'providers/Project/projectHooks';

const styles: SXStyles = {
  root: {
    background: 'white',
    display: 'flex',
    gridArea: 'header',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '1em',
    paddingRight: '1em',
  },
  button: {
    border: '1px solid #DEE2E9',
    borderRadius: '8px',
    background: `${theme.colors.secondaryBackground}`,
    '&:hover': {
      background: `${theme.colors.menuBg}`,
    },
  },
};

const infoShowVersionModalProps = {
  title: `Playground Versions`,
  messages: [
    `Playground Version: Unknown`,
    `Cadence Version: Unknown`,
    `Emulator Version: Unknown`,
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
      const versions = data?.playgroundInfo;
      infoShowVersionModal.messages = [
        `Playground Version: ${versions?.apiVersion || 'Unknown'}`,
        `Cadence Version: ${versions?.cadenceVersion || 'Unknown'}`,
        `Emulator Version: ${versions?.emulatorVersion || 'Unknown'}`,
      ];
      setInfoShowVersionModal({ ...infoShowVersionModal });
    }
  }, [loading]);

  return (
    <>
      <Button
        sx={{ ...styles.button, width: 'unset' }}
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
