import React from 'react';
import { ChildProps } from 'src/types';
import { Flex } from 'theme-ui';

import {
  EditorHeader,
  EditorPanelMenu,
  PanelContainer,
  PanelFooter,
  Template,
  TemplatesContainer,
} from './components';

const EditorPanel = ({ children }: ChildProps) => {
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
