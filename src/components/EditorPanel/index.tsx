import React from "react";
import { Flex } from "theme-ui";

import {
  TemplatesContainer,
  Template,
  PanelContainer,
  PanelFooter,
  EditorHeader,
  EditorPanelMenu
} from "./components";

const EditorPanel: React.FC = ({ children }) => {
  return (
    <Flex
      sx={{ flexDirection: "column", height: "100%", width: "100%" }}
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
  EditorPanelMenu
};
