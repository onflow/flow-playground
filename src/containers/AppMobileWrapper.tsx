import styled from '@emotion/styled';
import InformationalPopup from 'components/InformationalPopup';
import React from 'react';
import { ChildProps } from 'src/types';
import theme from '../theme';
import { useColorMode } from 'theme-ui'

const isInMaintenanceMode = process.env.IS_IN_MAINTENANCE === 'true';
const infoInMaintenance = {
  title: `Currently in Maintenance`,
  messages: [
    'Sorry about this, we are currently under maintenance. Check back soon.',
  ],
  disableActions: true,
};

const AppMobileWrapperDiv = styled.div`
  display: block;
  position: relative;
`;

const StyledReadOnly = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 16px;
  background: ${theme.colors.leftSidebarBackground};
  color: ${theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  padding: 2px 0;
  z-index: 100;
`;

const AppMobileWrapper = ({ children }: ChildProps) => {
  const [mode, setMode] = useColorMode()
  console.log('mode', mode)
  setMode('dark')
  console.log('mode', mode)
  return (
    <>
      <InformationalPopup
        onClose={() => {}}
        visible={isInMaintenanceMode}
        {...infoInMaintenance}
      />
      {theme.isMobile && <StyledReadOnly>Read Only Mode</StyledReadOnly>}
      {!isInMaintenanceMode && (
        <AppMobileWrapperDiv>{children}</AppMobileWrapperDiv>
      )}
    </>
  );
};

export default AppMobileWrapper;
