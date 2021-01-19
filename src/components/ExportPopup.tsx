import React, { useState, useRef, useEffect } from 'react';
import { useProject } from 'providers/Project/projectHooks';
import { default as FlowButton } from 'components/Button';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

import { createZip } from '../util/generator';

import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  const { project } = useProject();
  const [processing, setProcessing] = useState(false);
  const [projectName, setProjectName] = useState(`project-${project.id}`);
  const [folderName, setFolderName] = useState('cadence');

  const firstInput = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    firstInput.current?.focus();
  }, [firstInput.current]);

  return (
    visible && (
      <FullScreenContainer elevation={15}>
        <PopupContainer width="350px">
          <PopupHeader mb="20px" color="#575E89" lineColor="#B4BEFC">
            Export Project
          </PopupHeader>
          <InputBlock mb={'12px'}>
            <Label>Project Name</Label>
            <Input
              ref={firstInput}
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </InputBlock>
          <InputBlock mb={'30px'}>
            <Label>Cadence Folder</Label>
            <Input
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
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
    )
  );
};

export default ExportPopup;
