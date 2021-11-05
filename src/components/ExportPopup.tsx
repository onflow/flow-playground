import React, { useState, useRef, useEffect } from 'react';
import { uniqueNamesGenerator, adjectives, colors, } from 'unique-names-generator';
import { FaSyncAlt } from 'react-icons/fa';
import { useProject } from 'providers/Project/projectHooks';
import { default as FlowButton } from 'components/Button';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

import { createZip } from 'util/generator';

import {
  Input,
  InputBlock, InputIcon,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const generateProjectName = () => {
  const prefix: string = uniqueNamesGenerator({
    dictionaries: [colors, adjectives],
    separator: '-',
    length: 2,
  })

  return `${prefix}-playground`
}

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const { project } = useProject();
  const [processing, setProcessing] = useState(false);
  const [projectName, setProjectName] = useState(generateProjectName());
  const [folderName, setFolderName] = useState('cadence');

  const regenerateProjectName = () => {
    const newName = generateProjectName()
    setProjectName(newName)
  }

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
      y: -200,
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
      <PopupContainer width="350px" variants={popupFrames}>
        <PopupHeader mb="20px" color="#575E89" lineColor="#B4BEFC">
          Export Project
        </PopupHeader>
        <InputBlock mb={'12px'}>
          <Label>Project Name</Label>
          <Input
            ref={firstInput}
            value={projectName}
            onChange={event => setProjectName(event.target.value)}
          />
          <InputIcon icon={<FaSyncAlt/>} onClick={regenerateProjectName}/>
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
                await createZip(folderName, projectName, project);
                setProcessing(false);
                triggerClose(null);
              }}
            >
              Export
            </FlowButton>
          </SpaceBetween>
        )}
      </PopupContainer>
      <WhiteOverlay onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default ExportPopup;
