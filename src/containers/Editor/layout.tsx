import React, { useState, useEffect } from "react";
import { Button, Flex, Text } from "theme-ui";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCodeBranch, FaDiscord, FaTwitter, FaArrowAltCircleDown } from "react-icons/fa";

import { Header as HeaderRoot } from "layout/Header";
import { default as FlowButton } from "components/Button";
import { Separator } from "components/Common";
import Examples from "components/Examples";
import ExportPopup from "components/ExportPopup";
import Sidebar from "components/Sidebar";

import Mixpanel from "../../util/mixpanel";

import {
  EditorContainer,
  Header,
  NavButton,
  Nav,
  ShareSaveButton,
  AnimatedText
} from "./components";

import { useProject } from "providers/Project/projectHooks";


const FDP = [
  "f1383d67-6f0a-4be7-8e61-f6141ebdd92c",
  "d1c458d3-7e00-44eb-a93f-544911315e35",
  "12f3643e-522c-481a-9901-f6a0e93e17aa",
  "88c52aea-76e0-4096-bca1-8cdde66e2fc5",
  "068f7218-98b7-4674-bf13-774155d145f0"
];

const EditorLayout: React.FC = () => {
  const [showExport, toggleShowExport] = useState(false);
  const [showExamples, toggleShowExamples] = useState(false);
  const [projectIsPlayground, setIsPlayground] = useState(false);

  const { project, mutator, isSavingCode, isLoading, active } = useProject();

  useEffect(() => {
    if (project && project.id) {
      setIsPlayground(FDP.includes(project.id));
    }
  }, [project]);

  if (!isLoading && !project) {
    // NOTE: Leave this. 404 redirect is handled in
    // projectHooks.tsx. Show nothing before navigating.
    return <></>;
  }

  return (
    <>
      <HeaderRoot>
        <Header>
          <Flex
            sx={{
              alignItems: "center"
            }}
          >
            <img src="/flow_logo.jpg" alt="Flow Logo" width="40" height="40" />
            <Text
              pl={1}
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                position: "relative"
              }}
            >
              Playground
            </Text>

            {!projectIsPlayground && (
              <Button
                variant="secondary"
                sx={{
                  position: "relative",
                  top: "2px"
                }}
                ml={2}
                onClick={() => {
                  toggleShowExamples(true);
                  Mixpanel.track("Show examples", { meta: "none" });
                }}
              >
                <AnimatedText>Click here to start a tutorial</AnimatedText>
              </Button>
            )}
          </Flex>
          {/* <Text>New Project</Text> */}
          <Nav>
            <Flex
              sx={{
                alignItems: "center"
              }}>
              <Text
                sx={{
                  fontWeight: "body",
                  color: "darkGrey",
                  fontSize: "13px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  marginRight: "15px"
                }}
              >
                <AnimatePresence exitBeforeEnter>
                  {project && project.persist && isSavingCode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0
                      }}
                      key="1"
                    >
                      Autosaving...
                    </motion.div>
                  )}
                  {project && project.persist && !isSavingCode && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0
                      }}
                      key="2"
                    >
                      All changes saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </Text>
              {project && (
                <ShareSaveButton
                  url={window.location.href}
                  saveText={project.parentId ? "Fork" : "Save"}
                  showShare={project.persist}
                  onSave={() => mutator.saveProject(!!project.parentId)}
                  icon={project.parentId ? FaCodeBranch : FaCloudUploadAlt}
                />
              )}
              <a
                style={{ display: "flex" }}
                href="https://twitter.com/flow_blockchain"
                target="_blank"
                rel="noopener"
              >
                <NavButton>
                  <FaTwitter size={"20px"} />
                </NavButton>
              </a>
              <a
                style={{ display: "flex" }}
                href="https://discord.gg/2h6hgBF"
                target="_blank"
                rel="noopener"
              >
                <NavButton>
                  <FaDiscord size={"20px"} />
                </NavButton>
              </a>
              <a
                style={{ display: "flex", textDecoration: "none" }}
                href="https://docs.onflow.org"
                target="_blank"
                rel="noopener"
              >
                <NavButton>Flow Docs</NavButton>
              </a>
              {project && (
                <>
                <Separator/>
                <FlowButton
                  className="violet"
                  onClick={() => toggleShowExport(true)}
                  Icon={FaArrowAltCircleDown}
                >Export
                </FlowButton>
                </>
              )}
            </Flex>
          </Nav>
        </Header>
      </HeaderRoot>
      <Sidebar />
      <EditorContainer
        isLoading={isLoading}
        project={project}
        active={active}
      />
      <Examples
        visible={showExamples}
        triggerClose={() => {
          toggleShowExamples(false);
        }}
      />
      <ExportPopup visible={showExport} triggerClose={()=>{
        toggleShowExport(false)
      }}/>
    </>
  );
};

export default EditorLayout;
