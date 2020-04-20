import React, { useState, useEffect } from "react";
import {
  useSetExecutionResultsMutation,
  ResultType
} from "../api/apollo/generated/graphql";

import { FaArrowCircleRight } from "react-icons/fa";
import { GoGrabber } from "react-icons/go";
import Button from "./Button";
import { useProject } from "providers/Project/projectHooks";
import useMousePosition from "../hooks/useMousePosition";
import { Feedback as FeedbackRoot } from "layout/Feedback";
import { FeedbackActions } from "layout/FeedbackActions";
import { SidebarItemInsert } from "layout/SidebarItemInsert";
import styled from "@emotion/styled";
import theme from "../theme";
import { Heading } from "layout/Heading";

import { RenderResponse } from "components/RenderResponse";
import { ClearResults } from "./TransactionBottomBar";

const RESOURCE_PANEL_MIN_HEIGHT = 180;
const PLAYGROUND_HEADER_HEIGHT = 75;

const TypeListItem = styled.li<{ active: boolean }>`
  padding: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2f2f2f;
  ${li => (li.active ? "background: #f5f5f5;" : "")}
  &:hover {
    background: #f5f5f5;
  }
`;

const AccountStateContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-even;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  border-top: var(--gap) solid var(--key);
  min-height: ${p => p.height || RESOURCE_PANEL_MIN_HEIGHT}px;
`;

const ResourceListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: var(--gap) solid var(--key);
`;

const DeploymentResultContainer = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background: white;
  border-top: var(--gap) solid var(--key);
`;

interface TypeListProps {
  typeIds: string[];
  selected: string;
  onSelect: (type: string) => void;
  toggleResizing: (toggle: boolean) => void;
}
// @ts-ignore
const TypeList: React.FC<TypeListProps> = ({
  typeIds,
  selected,
  onSelect,
  toggleResizing
}) => (
  <ResourceListContainer>
    <Heading>
      Resources{" "}
      <SidebarItemInsert grab={true}>
        <GoGrabber size="16px" onMouseDown={() => toggleResizing(true)} />
      </SidebarItemInsert>
    </Heading>

    <div
      style={{
        width: "288px",
        overflow: "scroll"
      }}
    >
      <ul>
        {typeIds.map((type: string) => (
          <TypeListItem
            key={type}
            active={type == selected}
            onClick={() => onSelect(type)}
          >
            {type}
          </TypeListItem>
        ))}
      </ul>
    </div>
  </ResourceListContainer>
);

const StateContainer: React.FC<{ resource: any }> = ({ resource }) => (
  <div
    style={{
      width: "100%",
      backgroundColor: "#f3f3f3",
      paddingTop: "2em",
      paddingBottom: RESOURCE_PANEL_MIN_HEIGHT - 40,
      paddingLeft: "1.5em",
      fontFamily: theme.fonts.monospace,
      fontSize: theme.fontSizes[4],
      overflow: "scroll"
    }}
  >
    <pre>{JSON.stringify(resource, null, 2)}</pre>
  </div>
);

const AccountState: React.FC<{
  state: any;
  renderDeployButton: () => JSX.Element;
}> = ({ state, renderDeployButton }) => {
  if (!state) {
    state = "{}";
  }

  const resources: { [typeId: string]: string } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) continue;

    const [namespace, typeId] = key.split("\u001f");

    if (namespace === "private") {
      const ty = typeId
        .split(".")
        .slice(2)
        .join(".");
      resources[ty] = parsed[key];
    }
  }

  const typeIds = Object.keys(resources);

  // @ts-ignore
  const [selected, setSelected] = useState(
    typeIds.length > 0 ? typeIds[0] : null
  );

  const { x, y } = useMousePosition();
  const [panelHeight, setPanelHeight] = useState(RESOURCE_PANEL_MIN_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);

  const toggleResizing = (toggle: boolean) => {
    setIsResizing(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizing(false);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (
        isResizing &&
        y > RESOURCE_PANEL_MIN_HEIGHT &&
        y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
      ) {
        setPanelHeight(y);
      }
    }
  }, [x, y]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      //@ts-ignore
      window.addEventListener("mouseup", toggleResizeListener, false);
    }
    return () => {
      //@ts-ignore
      window.removeEventListener("mouseup", toggleResizeListener, false);
    };
  }, []);

  return (
    <div>
      <AccountStateContainer height={panelHeight}>
        {renderDeployButton()}
        <TypeList
          typeIds={typeIds}
          selected={selected}
          onSelect={setSelected}
          toggleResizing={toggleResizing}
        />
        <StateContainer resource={resources[selected]} />
      </AccountStateContainer>
      <DeploymentResultContainer>
        <Heading>
          Deployment Result
          <ClearResults type={ResultType.Contract} />
        </Heading>
        <RenderResponse resultType={ResultType.Contract} />
      </DeploymentResultContainer>
    </div>
  );
};

const AccountBottomBar: React.FC = () => {
  const {
    project,
    active,
    isLoading,
    updateAccountDeployedCode,
    isSavingCode
  } = useProject();

  const [setResult] = useSetExecutionResultsMutation();
  const [deployingContract, setDeployingContract] = useState(false);

  const deploy = async () => {
    if (
      project.accounts[active.index] &&
      project.accounts[active.index].deployedCode
    ) {
      if (
        !confirm("Redeploying will clear the state of all accounts. Proceed?")
      )
        return;
    }

    if (!deployingContract) {
      setDeployingContract(true);

      let rawResult;
      try {
        rawResult = await updateAccountDeployedCode();
      } catch (e) {
        rawResult = e.toString();
      }

      setDeployingContract(false);
      setResult({
        variables: {
          resultType: ResultType.Contract,
          rawResult,
          label: project.accounts[active.index].address
        }
      });
    }
  };

  return (
    <FeedbackRoot>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AccountState
            state={project.accounts[active.index].state}
            renderDeployButton={() => {
              return (
                <FeedbackActions>
                  <Button
                    onClick={deploy}
                    disabled={isSavingCode || deployingContract}
                    isLoading={deployingContract}
                    Icon={FaArrowCircleRight}
                  >
                    {project.accounts[active.index].deployedCode
                      ? "Redeploy"
                      : "Deploy"}
                  </Button>
                </FeedbackActions>
              );
            }}
          />
        </>
      )}
    </FeedbackRoot>
  );
};

export default AccountBottomBar;
