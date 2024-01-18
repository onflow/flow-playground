import React from 'react';
import AnnouncementBar from './Announcement';
import TopNav from '.';
import { isMobile } from '../Editor/CadenceEditor/ControlPanel/utils';

const headerStyle = {
    display: 'flex',
    gridArea: 'header',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'left',
};

const Header = ({isAnnouncementVisible}: {isAnnouncementVisible: boolean}) => {
    return (
      <header style={headerStyle}>
        {!isMobile() && isAnnouncementVisible && <AnnouncementBar />}
        <TopNav />

      </header>
    );
};

export default Header;