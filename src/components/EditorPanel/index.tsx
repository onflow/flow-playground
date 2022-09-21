import React from 'react';
import { Flex } from 'theme-ui';

import {
  EditorHeader,
  EditorPanelMenu,
  PanelContainer,
  PanelFooter,
  Template,
  TemplatesContainer,
} from './components';

const EditorPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      sx={{ flexDirection: 'column', height: '100%', width: '100%' }}
      variant="boxes.borderBox"
    >
      {children}
    </Flex>
  );
};

export {
  EditorPanel,
  TemplatesContainer,
  Template,
  PanelContainer,
  PanelFooter,
  EditorHeader,
  EditorPanelMenu,
};
