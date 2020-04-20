import React, { useState } from "react";
import { Flex, Box, Text } from "theme-ui";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { IoIosArrowUp } from "react-icons/io";

export const SavedTemplateContainer = styled(motion.div)`
  position: absolute;
  height: 100%;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SavedTemplate = styled(Flex)`
  width: 100%;
  height: 100px;
  margin-bottom: 1rem;
`;

export const TemplatesContainer = styled(motion.div)`
  grid-area: templates;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 1rem;
`;

export const Template = styled(motion.div)`
  width: 100%;
  color: ${(props: any) => props.theme.colors.text};
  border: 3px solid
    ${(props: any) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  background: ${props =>
    props.isSelected ? "white" : props.theme.colors.border};
  border-right: none;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  text-align: left;
  padding: 0.5rem;
  margin-bottom: 0.2rem;
  z-index: 10;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

export const PanelContainer = styled(motion.div)`
  position: relative;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 20fr;
  grid-template-areas: "templates editor";
`;

export const PanelFooter: React.FC<{ dismiss: () => void }> = ({
  children,
  dismiss
}) => {
  const [open, setOpen] = useState(false);
  return children ? (
    <motion.div
      style={{
        position: "absolute",
        bottom: "-4px",
        width: "100%"
      }}
      variants={{
        open: { height: "50%" },
        closed: { height: "auto" }
      }}
      initial="closed"
      animate={open && children ? "open" : "closed"}
    >
      <Flex
        py={"0.5rem"}
        px={1}
        sx={{
          backgroundColor: "border",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative"
        }}
        onClick={() => setOpen(!open)}
      >
        <motion.div
          style={{
            height: "1rem",
            cursor: "pointer",
            position: "absolute",
            left: "21px;"
          }}
          variants={{
            open: { transform: "rotate(-180deg)", top: "10px" },
            closed: { transform: "rotate(0deg)", top: "5px" }
          }}
          initial="closed"
          animate={open && children ? "open" : "closed"}
        >
          {children && <IoIosArrowUp />}
        </motion.div>
        <Box
          sx={{
            overflowY: open && children ? "scroll" : "hidden",
            display: "flex",
            maxWidth: "80%",
            marginLeft: "2rem"
          }}
        >
          <AnimatePresence>{children}</AnimatePresence>
        </Box>
        <Box
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
            dismiss();
          }}
          sx={{}}
        >
          <Text
            sx={{
              fontSize: 3,
              color: "purple",
              "&:hover": {
                cursor: "pointer"
              }
            }}
          >
            Dismiss
          </Text>
        </Box>
      </Flex>
    </motion.div>
  ) : null;
};

export const EditorHeader: React.FC = ({ children }) => {
  return (
    <Flex
      py={1}
      pr={2}
      pt={0}
      sx={{
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%"
      }}
    >
      {children}
    </Flex>
  );
};

export const EditorPanelMenu: React.FC = ({ children }) => {
  return (
    <Flex
      p={1}
      sx={{
        alignItems: "center"
      }}
    >
      {children}
    </Flex>
  );
};
