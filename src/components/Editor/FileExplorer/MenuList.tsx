import { useLocation } from '@reach/router';
import { ExportButton } from 'components/ExportButton';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { getParams } from 'util/url';
import useKeyPress from '../../../hooks/useKeyPress';
import Button from 'components/Button';
import ExplorerPlusIcon from 'components/Icons/ExplorerPlusIcon';
import ExplorerFileIcon from 'components/Icons/ExplorerFileIcon';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
import Input from 'components/Input';
import ExplorerFileShutterIcon from 'components/Icons/ExplorerFileShutterIcon';

const styles: SXStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 450,
    lineHeight: '100%',
    letterSpacing: '-0.02em',
    color: '#2F353F',
    alignItems: 'start',
    font: 'IBM Plex Mono',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    '&:hover': { borderRadius: '16px' },
  },
  fileShutterOpened: {
    position: 'absolute',
    left: '0px',
    transform: 'none',
    '&:hover': {
      background: 'none',
    },
  },
  fileShutterClosed: {
    position: 'absolute',
    left: '0px',
    transform: 'rotate(180deg)',
    '&:hover': {
      background: 'none',
    },
  },
  icon: {
    paddingRight: '12px',
  },
  selectedIcon: {
    paddingRight: '12px',
    filter:
      'brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(3637%) hue-rotate(242deg) brightness(95%) contrast(100%)',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'start',
    padding: '0px 24px',
    '&:hover': {
      background: '#DEE2E9',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#3031D1',
    },
    '&:hover .menu-icon': {
      filter:
        'brightness(0) saturate(100%) invert(14%) sepia(96%) saturate(3637%) hue-rotate(242deg) brightness(95%) contrast(100%)',
    },
  },
  selectedItem: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    justifyContent: 'start',
    padding: '0px 24px',
    background: '#EAEAFA',
    borderRadius: '8px',
    color: '#3031D1',
  },
  input: {
    width: '100%',
    marginRight: '0.5rem',
    fontSize: '15px',
    color: '#69717E',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: '1px solid #dedede',
    pointerEvents: 'initial',
    background: '#FFFFFF',
  },
  inputReadOnly: {
    width: '100%',
    marginRight: '0.5rem',
    fontSize: '15px',
    color: 'inherit',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: '1px solid transparent',
    background: 'none',
    pointerEvents: 'none',
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
  const [isFileShuttered, setIsFileShuttered] = useState(false);

  const toggleFileShutter = () => {
    setIsFileShuttered(!isFileShuttered);
  };

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
    switch (title) {
      case 'Transaction':
        return <ExplorerTransactionIcon />;
      case 'Script':
        return <ExplorerScriptIcon />;
      default:
        return <ExplorerContractIcon />;
    }
  };

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
          <Button
            sx={
              isFileShuttered
                ? styles.fileShutterClosed
                : styles.fileShutterOpened
            }
            variant="secondary"
            onClick={toggleFileShutter}
          >
            <ExplorerFileShutterIcon />
          </Button>
          <Box sx={{ paddingRight: '8px' }}>
            <ExplorerFileIcon />
          </Box>
          {title}
        </Flex>
        {!!onInsert && (
          <Button
            sx={styles.button}
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
      {isFileShuttered ? (
        <></>
      ) : (
        <Box>
          {items.map((item, i) => {
            const isActive = active.type === itemType && item.id === params.id;
            const dataTest = `sidebar-${item.title}`;
            const inputRef = editing.includes(i) ? setEditingRef : () => {};
            const isReadOnly = !editing.includes(i);
            return (
              <Flex
                sx={isActive ? styles.selectedItem : styles.item}
                title={item.title}
                key={item.id}
                onClick={(e: React.SyntheticEvent<Element, Event>) =>
                  onSelect(e, item.id)
                }
                onDoubleClick={() => toggleEditing(i, item.title)}
                data-test={dataTest}
              >
                <Box
                  className="menu-icon"
                  sx={isActive ? styles.selectedIcon : styles.icon}
                >
                  {getIcon(item.title)}
                </Box>
                {/* NOTE: Optimize this to a controlled input! */}

                <Input
                  ref={inputRef}
                  sx={isReadOnly ? styles.inputReadOnly : styles.input}
                  type="text"
                  onBlur={(e: any) => {
                    if (e.target.value.length === 0) {
                      isEditing.current.value = item.title;
                    } else {
                      toggleEditing(i, e.target.value);
                    }
                  }}
                  defaultValue={item.title}
                  onChange={(e: any) => {
                    if (e.target.value.length > NAME_MAX_CHARS) {
                      isEditing.current.value = e.target.value.substr(
                        0,
                        NAME_MAX_CHARS - 1,
                      );
                    }
                  }}
                />
                {isActive && (
                  <ExportButton id={item.id} typeName={item.__typename} />
                )}

                {!editing.includes(i) && isActive && items.length > 1 && (
                  <Box
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <FaTimes />
                  </Box>
                )}
              </Flex>
            );
          })}
        </Box>
      )}
    </Flex>
  );
};

export default MenuList;
