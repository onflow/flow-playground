import { useLocation } from '@reach/router';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { SyntheticEvent, useEffect, useRef, useState, forwardRef, ChangeEvent, ForwardedRef } from 'react';
import { ChildProps, SXStyles } from 'src/types';
import { Box, Flex, ThemeUICSSObject } from 'theme-ui';
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
import ExplorerEllipseIcon from 'components/Icons/ExplorerEllipseIcon';
import FileExplorerSubMenu from './FileExplorerSubMenu';

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
    fontFamily: 'IBM Plex Mono',
    padding: '8px 0px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: '8px',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    '&:hover': { borderRadius: '16px' },
    padding: '0px',
  },
  fileShutterOpened: {
    position: 'absolute',
    left: '0px',
    transform: 'none',
    padding: '0px 0px 0px 8px',
    '&:hover': {
      background: 'none',
    },
  },
  fileShutterClosed: {
    position: 'absolute',
    left: '0px',
    transform: 'rotate(180deg)',
    padding: '0px 8px 0px 0px',
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
    marginLeft: '16px',
    paddingLeft: '8px',
    fontFamily: 'inherit',
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
    '&:hover button': {
      visibility: 'visible',
    },
  },
  selectedItem: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    justifyContent: 'start',
    marginLeft: '16px',
    paddingLeft: '8px',
    background: '#EAEAFA',
    borderRadius: '8px',
    color: '#3031D1',
  },
  input: {
    width: '100%',
    fontSize: '15px',
    color: '#69717E',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: '1px solid #dedede',
    pointerEvents: 'initial',
    background: '#FFFFFF',
    fontFamily: 'inherit',
  },
  inputReadOnly: {
    width: '100%',
    fontSize: '15px',
    color: 'inherit',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: '1px solid transparent',
    background: 'none',
    pointerEvents: 'none',
    fontFamily: 'inherit',
  },
  ctaButton: {
    visibility: 'hidden',
    alignSelf: 'baseline',
    padding: '0px 8px 0px 0px',
    '&:hover': {
      background: 'none',
    },
  },
  ctaButtonSelected: {
    alignSelf: 'baseline',
    padding: '0px 8px 0px 0px',
    '&:hover': {
      background: 'none',
    },
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

interface ForwardInputProps extends ChildProps {
  _ref: ForwardedRef<HTMLInputElement>
  sx: SXStyles,
  defaultValue: string;
  onClick?: () => void;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent) => void;
  type: string;
}

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
  const [isSubMenuOpened, setIsSubMenuOpened] = useState(false);

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

  const ForwardInput = forwardRef<ThemeUICSSObject>(({_ref, sx, defaultValue, onBlur, onClick, type}: ForwardInputProps) => (
    <Input
      ref={_ref}
      sx={sx}
      type={type}
      defaultValue={defaultValue}
      onBlur={onBlur}
      onClick={onClick}
    />
  ))

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
            disabled={false}
            inline={true}
            sx={
              isFileShuttered
                ? styles.fileShutterClosed
                : styles.fileShutterOpened
            }
            variant="explorer"
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
            inline={true}
            sx={styles.button}
            disabled={isInserting}
            variant="explorer"
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
            const inputStyles = editing.includes(i) ? styles.input : styles.inputReadOnly;
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

                <ForwardInput
                  ref={inputRef}
                  sx={inputStyles}
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
                {
                  // TODO: Separate button from Parent onClick
                }
                <Button
                  sx={isActive ? styles.ctaButtonSelected : styles.ctaButton}
                  inline={true}
                  variant="explorer"
                  onClick={() => setIsSubMenuOpened(!isSubMenuOpened)}
                >
                  <ExplorerEllipseIcon />
                </Button>
                {isSubMenuOpened ?? <FileExplorerSubMenu />}

                {/* TODO: Duplicate file, Delete file, Update Filename userflows 
                {!editing.includes(i) && isActive && items.length > 1 && (
                  <Box
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <FaTimes />
                  </Box>
                )} */}
              </Flex>
            );
          })}
        </Box>
      )}
    </Flex>
  );
};

export default MenuList;
