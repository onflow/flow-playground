import React from 'react';
import TopNav from '.';

const headerStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'header',
  flexDirection: 'column' as 'column',
  alignItems: 'center',
  justifyContent: 'left',
};

const Header = () => {
  return (
    <header style={headerStyle}>
      <TopNav />
    </header>
  );
};

export default Header;
