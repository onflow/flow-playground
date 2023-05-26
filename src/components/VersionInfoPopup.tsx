import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import { SXStyles } from 'src/types';
import theme from '../theme';
import InfoIcon from 'components/Icons/InfoIcon';
import InformationalPopup from 'components/InformationalPopup';
import { useQuery } from '@apollo/react-hooks';
import { GET_PROJECTS, GET_VERSIONS } from 'api/apollo/queries';
import { PlaygroundInfo } from 'api/apollo/generated/graphql';

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
    background: '#F6F7F9',
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
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [infoShowVersionModal, setInfoShowVersionModal] = useState({
    ...infoShowVersionModalProps,
  });

  const { loading, error, data } = useQuery<{
    versions: PlaygroundInfo;
  }>(GET_VERSIONS, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    if (!loading && !error && data?.versions) {
      const versions = data?.versions;
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
