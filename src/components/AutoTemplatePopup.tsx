import React, { useState, useRef, useEffect } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
// import { useProject } from 'providers/Project/projectHooks';
import { default as FlowButton } from 'components/Button';
import theme from '../theme';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const AutoTemplatePopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  // const { project } = useProject();
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("My amazing script or transaction");
  const [folderName, setFolderName] = useState('cadence');

  const firstInput = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    firstInput.current.focus();
  }, [firstInput.current]);

  const containerFrames = {
    visible: {
      display: 'flex',
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
      zIndex: 20,
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0,
        staggerDirection: -1,
      },
      zIndex: -1,
    },
  };

  const spring = {
    type: 'spring',
    damping: 11,
    stiffness: 120,
  };

  const popupFrames = {
    visible: {
      opacity: 1,
      y: 0,
      transition: spring,
    },
    hidden: {
      opacity: 0,
      y: 200,
      transition: {
        ease: [1, 0.5, 0, 0]
      },
    },
  };

  return (
    <FullScreenContainer
      elevation={15}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={containerFrames}
    >
      <PopupContainer width="550px" variants={popupFrames}>
        <PopupHeader mb="20px" color={theme.colors.darkGrey} lineColor={theme.colors.primary}>
          Create a Script or Transaction Template
        </PopupHeader>
        <InputBlock mb={'12px'}>
          <Label>Name</Label>
          <Input
            ref={firstInput}
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </InputBlock>
        <InputBlock mb={'30px'}>
          <Label>Cadence Folder</Label>
          <Input
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
        </InputBlock>
        {processing ? (
          <p>Processing...</p>
        ) : (
          <SpaceBetween>
            <FlowButton className="grey modal" onClick={triggerClose}>
              Close
            </FlowButton>
            <FlowButton
              className="violet modal"
              onClick={async () => {
                setProcessing(true);
                setProcessing(false);
                triggerClose(null);
              }}
            >
              Export
            </FlowButton>
          </SpaceBetween>
        )}
      </PopupContainer>
      <WhiteOverlay opacity={0.5} onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default AutoTemplatePopup;
