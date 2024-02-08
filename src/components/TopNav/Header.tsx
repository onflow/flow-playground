import React, { useContext } from 'react';
import AnnouncementBar from './Announcement';
import TopNav from '.';
import { isMobile } from '../Editor/CadenceEditor/ControlPanel/utils';
import { AnnouncementContext } from 'providers/Announcement';

const headerStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'header',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  justifyContent: 'left',
};

const Header = () => {
  const { isVisible: isAnnouncementVisible } = useContext(AnnouncementContext);
  return (
    <header style={headerStyle}>
      {!isMobile() && isAnnouncementVisible && <AnnouncementBar />}
      <TopNav />
    </header>
  );
};

export default Header;
