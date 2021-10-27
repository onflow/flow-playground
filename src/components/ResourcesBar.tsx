import React, { useState, useEffect } from 'react';
import { Badge, Flex, Box, Divider } from 'theme-ui';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useProject } from 'providers/Project/projectHooks';
import useMousePosition from '../hooks/useMousePosition';
import TemplatePopup from "components/TemplatePopup";
import { Feedback as FeedbackRoot } from 'layout/Feedback';
import { FeedbackActions } from 'layout/FeedbackActions';
import { SidebarItemInsert } from 'layout/SidebarItemInsert';
import { BottomBarItemInsert } from 'layout/BottomBarItemInsert';
import styled from '@emotion/styled';
import { storageMap } from '../util/accounts';
import { getStorageData } from '../util/storage';
import theme from '../theme';
import { ResizeHeading } from 'layout/Heading';

const RESULT_PANEL_MIN_HEIGHT = 80;
const STORAGE_PANEL_MIN_HEIGHT = 80 + RESULT_PANEL_MIN_HEIGHT;
const PLAYGROUND_HEADER_HEIGHT = 75;

const TypeListItem = styled.li<{ active: boolean }>`
  align-items: center;
  padding: 14px;
  display: flex;
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

const StorageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: var(--gap) solid var(--key);
`;

interface StorageBadgeProps {
  type: string;
}

const StorageBadge: React.FC<StorageBadgeProps> = ({
  type
}) => {
  console.log("STORAGE BADGE TYPE", type);
  
  return (
    <Badge
      variant="outline"
      px={"5px"}
      sx={{
        fontSize: 3,
        fontStyle: "normal",
        paddingX: "5px",
        paddingY: "2px",
        marginX: "0.5rem",
        backgroundColor: () => {
          switch (type) {
            case "Struct":
              return theme.colors.badgeStruct;
            case "Resource":
              return theme.colors.badgeResource;
            case "Link":
              return theme.colors.badgeCapability;
            case null:
              return theme.colors.badgeNull;
          }
        },
      }}
    >
      {type === "Link" ? "Capability" : type}
      {type === null && "null"}
    </Badge>
  );
};

interface IdentifierTypeListProps {
  types: { [identifier: string]: string };
  selected: string;
  onSelect: (type: string) => void;
  controls: () => any;
  resize: () => any;
}
// @ts-ignore
const IdentifierTypeList: React.FC<IdentifierTypeListProps> = ({
  types,
  selected,
  onSelect,
  controls,
  resize,
}) => {

  const [showTemplatePopup, toggleShowTemplatePopup] = useState<boolean>(false);

  const { selectedResourceAccount } = useProject();
  
  return (
    <>
      <StorageListContainer>
        <ResizeHeading 
          onMouseDown={resize}
          textTransform="none"
        > 
          ACCOUNT {selectedResourceAccount} STORAGE {controls()}
        </ResizeHeading>
        <div
          style={{
            width: '288px',
            overflow: 'auto',
          }}
        >
          <ul>
            {Object.keys(types).map((key) => {
              const identifierType = types[key];
              return(
                <TypeListItem
                  key={key}
                  active={key == selected}
                  onClick={() => onSelect(key)}
                >
                  <Flex
                    sx={{
                      flex: "1 1 auto"
                    }}
                  >
                    {key}
                    <StorageBadge
                      type={identifierType}
                    />
                  </Flex>
                  <Flex>
                    {identifierType == "Link" &&
                      <BottomBarItemInsert onClick={async () => {
                        toggleShowTemplatePopup(true)
                      }}>
                        <IoMdAddCircleOutline size="20px" />
                      </BottomBarItemInsert>
                    }
                  </Flex>
                </TypeListItem>
              )
            })}
          </ul>
        </div>
      </StorageListContainer>
      <TemplatePopup 
        visible={showTemplatePopup} 
        triggerClose={() => {
          toggleShowTemplatePopup(false)
        }}
      />
    </>
  );
};

const StateContainer: React.FC<{ 
  value?: any 
  path?: any
}> = ({ value, path }) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#f3f3f3',
      paddingTop: '1.0em',
      paddingBottom: STORAGE_PANEL_MIN_HEIGHT - 40,
      paddingLeft: '1.5em',
      overflow: 'scroll',
    }}
  >
    {value ?
      <>
        <Flex
          sx={{
          }}
        >
          <Box
            sx={{
              padding: "0.25rem",
              minWidth: "75px",
              font: theme.fonts.body,
              fontSize: theme.fontSizes[4]
            }}
          >
            Path:
          </Box>
          <Box
            sx={{
              padding: "0.25rem",
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[4]
            }}
          >
            {path}
          </Box>
        </Flex>
        <Divider 
          sx={{
            color: theme.colors.grey,
            opacity: "0.7",
            marginX: "2rem",
            marginY: "0.5rem"
          }}
        />
        <Flex
          sx={{
          }}
        >
          <Box
            sx={{
              padding: "0.25rem",
              minWidth: "75px",
              font: theme.fonts.body,
              fontSize: theme.fontSizes[4]
            }}
          >
            Object:
          </Box>
          <Box
            sx={{
              padding: "0.25rem",
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[4]
            }}
          >
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </Box>
        </Flex>
      </>
      :
      '(account storage is empty)'
    }
  </div>
);

const AccountState: React.FC<{
  state: any;
  selectedResourcesAccount: string;
  renderDeployButton: () => JSX.Element;
  resultHeight: number;
}> = ({ state, selectedResourcesAccount, resultHeight }) => {

  const { storage, paths, types } = getStorageData(state);

  const identifiers = Object.keys(storage);
 
  // @ts-ignore
  const [selected, setSelected] = useState(
    identifiers.length > 0 ? identifiers[0] : null,
  );

  const { x, y } = useMousePosition();
  const [storageHeight, setStorageHeight] = useState(STORAGE_PANEL_MIN_HEIGHT);
  const [isResizingStorage, setIsResizingStorage] = useState(false);

  const toggleResizingStorage = (toggle: boolean) => {
    setIsResizingStorage(toggle);
  };

  const toggleResizeListener = () => {
    toggleResizingStorage(false);
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
    window.addEventListener('mouseup', toggleResizeListener, false);
    return () => {
      window.removeEventListener('mouseup', toggleResizeListener, false);
    };
  }, []);

  return (
    <>
      {selectedResourcesAccount !== 'none' && (
          <AccountStateContainer height={storageHeight + resultHeight}>
            <IdentifierTypeList
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
            <StateContainer 
              value={storage[selected] || storage[identifiers[0]]} 
              path={paths[selected] || paths[identifiers[0]]} 
            />
          </AccountStateContainer>
      )}
    </>
  );
};

interface ResourcesBarProps {
  resultHeight: number;
}

const ResourcesBar: React.FC<ResourcesBarProps> = ({ resultHeight }) => {
  const { project, isLoading, selectedResourceAccount } = useProject();

  return (
    <FeedbackRoot>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        selectedResourceAccount && <AccountState
          state={project.accounts[storageMap[selectedResourceAccount] || 0].state}
          selectedResourcesAccount={selectedResourceAccount}
          renderDeployButton={() => {
            return <FeedbackActions />;
          }}
          resultHeight={resultHeight}
        />
      )}
    </FeedbackRoot>
  );
};

export default ResourcesBar;
