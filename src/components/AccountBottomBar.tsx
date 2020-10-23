import React, { useState, useEffect } from "react";
import { ResultType } from "api/apollo/generated/graphql";

import { GoGrabber } from "react-icons/go";
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

const STORAGE_PANEL_MIN_HEIGHT = 180;
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
  min-height: ${p => p.height || STORAGE_PANEL_MIN_HEIGHT}px;
`;

const StorageListContainer = styled.div`
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
  identifiers: string[];
  selected: string;
  onSelect: (type: string) => void;
  toggleResizing: (toggle: boolean) => void;
}
// @ts-ignore
const IdentifierList: React.FC<TypeListProps> = ({
  identifiers,
  selected,
  onSelect,
  toggleResizing
}) => (
  <StorageListContainer>
    <Heading>
      Storage{" "}
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
        {identifiers.map((type: string) => (
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
  </StorageListContainer>
);

const StateContainer: React.FC<{ value: any }> = ({ value }) => (
  <div
    style={{
      width: "100%",
      backgroundColor: "#f3f3f3",
      paddingTop: "2em",
      paddingBottom: STORAGE_PANEL_MIN_HEIGHT - 40,
      paddingLeft: "1.5em",
      fontFamily: theme.fonts.monospace,
      fontSize: theme.fontSizes[4],
      overflow: "scroll"
    }}
  >
    <pre>{JSON.stringify(value, null, 2)}</pre>
  </div>
);

const AccountState: React.FC<{
  state: any;
  renderDeployButton: () => JSX.Element;
}> = ({ state, renderDeployButton }) => {
  if (!state) {
    state = "{}";
  }

  const storage: { [identifier: string]: string } = {};

  const parsed = JSON.parse(state);

  for (let key in parsed) {
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const [domain, identifier] = key.split("\u001f");

    if (domain === "storage") {
      storage[identifier] = parsed[key];
    }
  }

  const identifiers = Object.keys(storage);

  // @ts-ignore
  const [selected, setSelected] = useState(
    identifiers.length > 0 ? identifiers[0] : null
  );

  const { x, y } = useMousePosition();
  const [panelHeight, setPanelHeight] = useState(STORAGE_PANEL_MIN_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);

  const toggleResizing = (toggle: boolean) => {
    setIsResizing(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizing(false);
  };

  useEffect(() => {
    if (
      isResizing &&
      y > STORAGE_PANEL_MIN_HEIGHT &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setPanelHeight(y);
    }
  }, [x, y]);

  useEffect(() => {
    window.addEventListener("mouseup", toggleResizeListener, false);
    return () => {
      window.removeEventListener("mouseup", toggleResizeListener, false);
    };
  }, []);

  return (
    <div>
      <AccountStateContainer height={panelHeight}>
        {renderDeployButton()}
        <IdentifierList
          identifiers={identifiers}
          selected={selected}
          onSelect={setSelected}
          toggleResizing={toggleResizing}
        />
        <StateContainer value={storage[selected]} />
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
  } = useProject();

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
                <FeedbackActions/>
              );
            }}
          />
        </>
      )}
    </FeedbackRoot>
  );
};

export default AccountBottomBar;
