import { useLocation } from '@reach/router';
import { ExportButton } from 'components/ExportButton';
import { SidebarItem } from 'layout/SidebarItem';
import { SidebarItemDelete } from 'layout/SidebarItemDelete';

import { SidebarItemInput } from 'layout/SidebarItemInput';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { getParams } from 'util/url';
import useKeyPress from '../../../hooks/useKeyPress';
import Button from 'components/Button';
import theme from '../../../theme';
import ExplorerPlusIcon from 'components/Icons/ExplorerPlusIcon';
import ExplorerFileIcon from 'components/Icons/ExplorerFileIcon';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 0px',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 450,
    lineHeight: '100%',
    letterSpacing: '-0.02em',
    color: '#2F353F',
    alignItems: 'start'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 'none',
    color: theme.colors.grey,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '16px',
    height: '16px',
  },
  icon: {
    paddingRight: '8px',
    paddingLeft: '8px',
  },
};

type MenuListProps = {
  active: number | null;
  title?: string;
  items: any[];
  onSelect: (e: SyntheticEvent, id: string) => void;
  onUpdate: any;
  onInsert: () => Promise<void>;
  onDelete: any;
};

const NAME_MAX_CHARS = 50;

const MenuList: React.FC<MenuListProps> = ({
  title,
  items,
  onSelect,
  onUpdate,
  onInsert,
  onDelete,
}) => {
  const { active } = useProject();
  const isEditing = useRef<HTMLInputElement>();
  const [editing, setEditing] = useState([]);
  const enterPressed = useKeyPress('Enter');
  const escapePressed = useKeyPress('Escape');
  const [isInserting, setIsInserting] = useState(false);


  const toggleEditing = (i: number, newTitle: string) => {
    if (editing.includes(i)) {
      let _editing = [...editing];
      _editing.splice(_editing.indexOf(i), 1);
      setEditing(_editing);
      onUpdate(items[i].id, items[i].script, newTitle);
      return;
    }
    return setEditing([...editing, i]);
  };

  useEffect(() => {
    if (enterPressed || escapePressed) {
      setEditing([]);
      isEditing.current?.blur();
    }
  }, [enterPressed, escapePressed]);

  const setEditingRef = (element: HTMLInputElement | undefined) => {
    isEditing.current = element;
    element?.focus();
    element?.select();
  };

  const getIcon = (title: string) => {
    console.log(title)
    switch(title) {
      case 'Transaction':
        return <ExplorerTransactionIcon />
      case 'Script':
        return <ExplorerScriptIcon />
      default:
        return <ExplorerContractIcon />
    }
  }

  const isScript = title.toLowerCase().includes('script');
  const itemType = isScript
    ? EntityType.ScriptTemplate
    : EntityType.TransactionTemplate;

  const location = useLocation();
  const params = getParams(location.search);

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.header}>
        <Flex sx={styles.headerTitle}>
          <Box sx={{ paddingRight: '8px' }}>
            <ExplorerFileIcon />
          </Box>
          {title}
        </Flex>
        {!!onInsert && (
          <Button
            disabled={isInserting}
            variant="secondary"
            onClick={async () => {
              setIsInserting(true);
              try {
                await onInsert();
              } catch {
                setIsInserting(false);
              }
              setIsInserting(false);
            }}
          >
            <ExplorerPlusIcon />
          </Button>
        )}
      </Flex>
      <Box>
        {items.map((item, i) => {
          const isActive = active.type === itemType && item.id === params.id;
          const dataTest = `sidebar-${item.title}`;
          return (
            <SidebarItem
              title={item.title}
              key={item.id}
              active={isActive}
              onClick={(e: React.SyntheticEvent<Element, Event>) =>
                onSelect(e, item.id)
              }
              onDoubleClick={() => toggleEditing(i, item.title)}
              data-test={dataTest}
            >
              <Box sx={styles.icon} >
                {getIcon(item.title)}
              </Box>
              {/* NOTE: Optimize this to a controlled input! */}

              <SidebarItemInput
                ref={editing.includes(i) ? setEditingRef : () => {}}
                type="text"
                onBlur={(e: any) => {
                  if (e.target.value.length === 0) {
                    isEditing.current.value = item.title;
                  } else {
                    toggleEditing(i, e.target.value);
                  }
                }}
                defaultValue={item.title}
                readonly={!editing.includes(i)}
                onChange={(e) => {
                  if (e.target.value.length > NAME_MAX_CHARS) {
                    isEditing.current.value = e.target.value.substr(
                      0,
                      NAME_MAX_CHARS - 1,
                    );
                  }
                }}
              />
              {isActive && <ExportButton id={item.id} typeName={item.__typename} />}

              {!editing.includes(i) && isActive && items.length > 1 && (
                <SidebarItemDelete
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <FaTimes />
                </SidebarItemDelete>
              )}
            </SidebarItem>
          );
        })}
      </Box>
    </Flex>
  );
};

export default MenuList;
