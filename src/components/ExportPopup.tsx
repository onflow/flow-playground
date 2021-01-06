import React from 'react';
import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween
} from 'components/Common';

const ExportPopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  return (
    visible && (
      <FullScreenContainer elevation={15}>
        <PopupContainer width="300px">
          <PopupHeader mb="20px">Export Project</PopupHeader>
          <p>Here we will show popup information</p>
          <SpaceBetween mb="20px">
            <button onClick={triggerClose}>Close</button>
            <button onClick={()=>{
              console.log("Exporting project. Please wait...")
            }}>Export</button>
          </SpaceBetween>
        </PopupContainer>
        <WhiteOverlay onClick={triggerClose} />
      </FullScreenContainer>
    )
  );
};

export default ExportPopup