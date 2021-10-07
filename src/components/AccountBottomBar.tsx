import React, { useState, useEffect } from 'react';
import { ResultType } from 'api/apollo/generated/graphql';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import {IoMdAddCircleOutline} from "react-icons/io";
import { useProject } from 'providers/Project/projectHooks';
import { navigate } from "@reach/router";
import { isUUUID } from "../util/url";
import useMousePosition from '../hooks/useMousePosition';
import { Feedback as FeedbackRoot } from 'layout/Feedback';
import { FeedbackActions } from 'layout/FeedbackActions';
import { SidebarItemInsert } from 'layout/SidebarItemInsert';
import { BottomBarItemInsert } from 'layout/BottomBarItemInsert';
import styled from '@emotion/styled';
import theme from '../theme';
import { ResizeHeading } from 'layout/Heading';

import { RenderResponse } from 'components/RenderResponse';
import { ClearResults } from './TransactionBottomBar';

const RESULT_PANEL_MIN_HEIGHT = 80;
const STORAGE_PANEL_MIN_HEIGHT = 80 + RESULT_PANEL_MIN_HEIGHT;
const PLAYGROUND_HEADER_HEIGHT = 75;

const TypeListItem = styled.li<{ active: boolean }>`
  padding: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #2f2f2f;
  ${(li) => (li.active ? 'background: #f5f5f5;' : '')}
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
  height: ${(p) => p.height}px;
`;

const DeploymentResultContainer = styled.div<{ height: number }>`
  position: absolute;
  bottom: 0px;
  width: 100%;
  background: white;
  border-top: var(--gap) solid var(--key);
  height: ${(p) => p.height}px;
  overflow-y: hidden;
`;

const StorageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: var(--gap) solid var(--key);
`;

interface TypeListProps {
  identifiers: string[];
  types: { [identifier: string]: string };
  selected: string;
  onSelect: (type: string) => void;
  controls: () => any;
  resize: () => any;
}
// @ts-ignore
const IdentifierList: React.FC<TypeListProps> = ({
  identifiers,
  types,
  selected,
  onSelect,
  controls,
  resize,
}) => {
  const { project, mutator, selectedResourceAccount } = useProject();
  console.log("SELECTED RESOURCE ACCOUNT FROM IDENTIFIERS LIST:", selectedResourceAccount);
  
  const projectPath = isUUUID(project.id) ? project.id : "local"

  return (
    <StorageListContainer>
      <ResizeHeading onMouseDown={resize}>Storage {controls()}</ResizeHeading>

      <div
        style={{
          width: '288px',
          overflow: 'auto',
        }}
      >
        <ul>
          {identifiers.map((identifier: string) => (
            <TypeListItem
              key={identifier}
              active={identifier == selected}
              onClick={() => onSelect(identifier)}
            >
              {identifier}
              {types[identifier] == "Link" &&
                <BottomBarItemInsert onClick={ async () => {
                  const res = await mutator.createTransactionTemplate("", `New Transaction`)
                  navigate(`/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${selectedResourceAccount + 1 || 'none'}`)
                }}>
                  <IoMdAddCircleOutline size="20px" />
                </BottomBarItemInsert>
              }

            </TypeListItem>
          ))}
        </ul>
      </div>
    </StorageListContainer>
  );
}

const StateContainer: React.FC<{ value: any }> = ({ value }) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#f3f3f3',
      paddingTop: '2em',
      paddingBottom: STORAGE_PANEL_MIN_HEIGHT - 40,
      paddingLeft: '1.5em',
      fontFamily: theme.fonts.monospace,
      fontSize: theme.fontSizes[4],
      overflow: 'scroll',
    }}
  >
    <pre>{JSON.stringify(value, null, 2)}</pre>
  </div>
);

const AccountState: React.FC<{
  state: any;
  renderDeployButton: () => JSX.Element;
}> = ({ state }) => {
  if (!state) {
    state = '{}';
  }

  const storage: { [identifier: string]: string } = {};

  const parsed = JSON.parse(state);
  // console.log("PARSED ACCOUNT STATE:", parsed);

  for (let key in parsed) {
    // console.log("KEY:", key);
    
    if (!parsed.hasOwnProperty(key)) {
      continue;
    }

    const tuple = key.split('\u001f')
    // console.log("KEY TUPLE:", tuple);
    
    const [domain, identifier] = tuple

    if (tuple.length === 2 && ['storage', 'public', 'private'].includes(domain)) {
      storage[identifier] = parsed[key];
    }
  }
  // console.log("STORAGE:", storage);
  
  const identifiers = Object.keys(storage);

  const types: { [identifier: string]: string } = {};
  for (const [key, value] of Object.entries<any>(storage)) {
    types[key] = value["value"]["type"]
  }
  // console.log("TYPES:", types);
  

  // @ts-ignore
  const [selected, setSelected] = useState(
    identifiers.length > 0 ? identifiers[0] : null,
  );
  // console.log("SELECTED:", selected);
  

  const { x, y } = useMousePosition();
  const [storageHeight, setStorageHeight] = useState(STORAGE_PANEL_MIN_HEIGHT);
  const [resultHeight, setResultHeight] = useState(RESULT_PANEL_MIN_HEIGHT);
  const [isResizingStorage, setIsResizingStorage] = useState(false);
  const [isResizingResult, setIsResizingResult] = useState(false);

  const toggleResizingStorage = (toggle: boolean) => {
    setIsResizingStorage(toggle);
  };

  const toggleResizingResult = (toggle: boolean) => {
    setIsResizingResult(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizingStorage(false);
    toggleResizingResult(false);
  };

  useEffect(() => {
    if (
      isResizingStorage &&
      y > STORAGE_PANEL_MIN_HEIGHT - 30 + resultHeight &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setStorageHeight(y - resultHeight);
    }
  }, [x, y]);

  useEffect(() => {
    if (
      isResizingResult &&
      y > RESULT_PANEL_MIN_HEIGHT &&
      y < window.innerHeight - PLAYGROUND_HEADER_HEIGHT
    ) {
      setResultHeight(y);
    }
  }, [x, y]);

  useEffect(() => {
    window.addEventListener('mouseup', toggleResizeListener, false);
    return () => {
      window.removeEventListener('mouseup', toggleResizeListener, false);
    };
  }, []);

  // console.log("STORAGE FROM INSIDE ACCOUNTBOTTOMBAR:", storage);
  
  return (
    <>
      {identifiers.length ? (
        <AccountStateContainer height={storageHeight + resultHeight}>
          <IdentifierList
            identifiers={identifiers}
            types={types}
            selected={selected}
            onSelect={setSelected}
            resize={() => toggleResizingStorage(true)}
            controls={() => {
              return (
                <SidebarItemInsert grab={false}>
                  {storageHeight > 40 ? (
                    <GoChevronDown
                      size="16px"
                      onClick={() => setStorageHeight(40)}
                    />
                  ) : (
                    <GoChevronUp
                      size="16px"
                      onClick={() =>
                        setStorageHeight(STORAGE_PANEL_MIN_HEIGHT * 2)
                      }
                    />
                  )}
                </SidebarItemInsert>
              );
            }}
          />
          <StateContainer value={storage[selected]} />
        </AccountStateContainer>
      ) : (
        ''
      )}
      <DeploymentResultContainer height={resultHeight}>
        <ResizeHeading onMouseDown={() => toggleResizingResult(true)}>
          Deployment Result
          <ClearResults type={ResultType.Contract} />
          {resultHeight > 40 ? (
            <GoChevronDown size="16px" onClick={() => setResultHeight(40)} />
          ) : (
            <GoChevronUp
              size="16px"
              onClick={() => setResultHeight(RESULT_PANEL_MIN_HEIGHT * 2)}
            />
          )}
        </ResizeHeading>
        <RenderResponse resultType={ResultType.Contract} />
      </DeploymentResultContainer>
    </>
  );
};

const AccountBottomBar: React.FC = () => {
  const { project, isLoading, selectedResourceAccount } = useProject();
  // console.log("ACCOUNT BOTTOM BAR PROJECT:", project.accounts[1].state);
  // console.log("SELECTED RESOURCE ACCOUNT:", selectedResourceAccount);
  // (project && selectedResourceAccount) && console.log("STATE FROM SELECTED:", project.accounts[selectedResourceAccount]);
  // (project) && console.log("STATE FROM SELECTED:", project.accounts[selectedResourceAccount].state);
  // console.log("SELECTED RESOURCE ACCOUNT:", selectedResourceAccount);
  
  

  
  
  // console.log("ACCOUNT BOTTOM BAR ACTIVE:", active);
  // console.log("SELECTED RESOURCE ACCOUNT IN ACCOUNT BOTTOM BAR:", selectedResourceAccount);
  

  return (
    <FeedbackRoot>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <AccountState
            // TODO: defaults to 0 when selectedResourceAccount resolves to null, need to handle this so no render happ
            state={project.accounts[selectedResourceAccount || 0].state}
            renderDeployButton={() => {
              return <FeedbackActions />;
            }}
          />
        </>
      )}
    </FeedbackRoot>
  );
};

export default AccountBottomBar;
