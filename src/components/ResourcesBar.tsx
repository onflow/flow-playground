import styled from '@emotion/styled';
import { Feedback as FeedbackRoot } from 'layout/Feedback';
import { FeedbackActions } from 'layout/FeedbackActions';
import { ResizeHeading } from 'layout/Heading';
import { SidebarItemInsert } from 'layout/SidebarItemInsert';
import { useProject } from 'providers/Project/projectHooks';
import React, { useEffect, useState } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { ChildProps } from 'src/types';
import { Badge, Box, Divider, Flex } from 'theme-ui';
import { storageMapByAddress } from 'util/accounts';
import { getStorageData } from 'util/storage';
import useMousePosition from '../hooks/useMousePosition';
import theme from '../theme';

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
  width: 100%;
  background: white;
  border-top: 1px solid ${theme.colors.greyBorder};
  height: ${(p) => p.height}px;
`;

const StorageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid ${theme.colors.greyBorder};
`;

interface StorageBadgeProps {
  type: string;
}

interface GeneralBadgeProps extends ChildProps {
  backgroundColor: string;
}

const GeneralBadge = ({ backgroundColor, children }: GeneralBadgeProps) => {
  return (
    <Badge
      variant="outline"
      px="5px"
      sx={{
        fontSize: 3,
        fontStyle: 'normal',
        paddingX: '5px',
        paddingY: '2px',
        marginLeft: '0.5rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor,
      }}
    >
      {children}
    </Badge>
  );
};

const StorageBadge = ({ type }: StorageBadgeProps) => {
  const backgroundColor =
    type === 'Resource'
      ? theme.colors.badgeResource
      : theme.colors.badgeCapability;

  return <GeneralBadge backgroundColor={backgroundColor}>{type}</GeneralBadge>;
};

const DomainBadge = ({ domain }: { domain: string }) => {
  return (
    <GeneralBadge backgroundColor={theme.colors.badgeNull}>
      {domain}
    </GeneralBadge>
  );
};

interface IdentifierTypeListProps {
  types: { [identifier: string]: string };
  paths: { [identifier: string]: string };
  selected: string;
  onSelect: (type: string) => void;
  controls: () => any;
  resize: () => any;
}
const IdentifierTypeList: React.FC<IdentifierTypeListProps> = ({
  types,
  paths,
  selected,
  onSelect,
  controls,
  resize,
}) => {
  const { selectedResourceAccount } = useProject();

  return (
    <>
      <StorageListContainer>
        <ResizeHeading onMouseDown={resize} textTransform="none">
          ACCOUNT {selectedResourceAccount} STORAGE {controls()}
        </ResizeHeading>
        <div
          style={{
            width: '340px',
            overflow: 'auto',
          }}
        >
          <ul>
            {Object.keys(types).map((key) => {
              const identifierType = types[key];
              const domain = (paths[key] || '').split('/')[1];
              return (
                <TypeListItem
                  key={key}
                  active={key == selected}
                  onClick={() => onSelect(key)}
                >
                  <Flex
                    sx={{
                      flex: '1 1 auto',
                    }}
                  >
                    {key}
                    <StorageBadge type={identifierType} />
                    {!!domain && <DomainBadge domain={domain} />}
                  </Flex>
                </TypeListItem>
              );
            })}
          </ul>
        </div>
      </StorageListContainer>
    </>
  );
};

const StateContainer: React.FC<{
  value?: any;
  path?: any;
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
    {value ? (
      <>
        <Flex sx={{}}>
          <Box
            sx={{
              padding: '0.25rem',
              minWidth: '75px',
              font: theme.fonts.body,
              fontSize: theme.fontSizes[4],
            }}
          >
            Path:
          </Box>
          <Box
            sx={{
              padding: '0.25rem',
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[4],
            }}
          >
            {path}
          </Box>
        </Flex>
        <Divider
          sx={{
            color: theme.colors.grey,
            opacity: '0.7',
            marginX: '2rem',
            marginY: '0.5rem',
          }}
        />
        <Flex sx={{}}>
          <Box
            sx={{
              padding: '0.25rem',
              minWidth: '75px',
              font: theme.fonts.body,
              fontSize: theme.fontSizes[4],
            }}
          >
            Object:
          </Box>
          <Box
            sx={{
              padding: '0.25rem',
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[4],
            }}
          >
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </Box>
        </Flex>
      </>
    ) : (
      '(account storage is empty)'
    )}
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
            paths={paths}
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
  const { project, selectedResourceAccount } = useProject();
  const accountState =
    project?.accounts?.[storageMapByAddress(selectedResourceAccount)]?.state;
  return (
    <FeedbackRoot>
      {selectedResourceAccount && !!accountState ? (
        <AccountState
          state={accountState}
          selectedResourcesAccount={selectedResourceAccount}
          renderDeployButton={() => {
            return <FeedbackActions />;
          }}
          resultHeight={resultHeight}
        />
      ) : (
        <p>Loading...</p>
      )}
    </FeedbackRoot>
  );
};

export default ResourcesBar;
