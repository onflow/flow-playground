import { useLocation } from '@reach/router';
import Button from 'components/Button';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerEllipseIcon from 'components/Icons/ExplorerEllipseIcon';
import ExplorerFileIcon from 'components/Icons/ExplorerFileIcon';
import ExplorerFileShutterIcon from 'components/Icons/ExplorerFileShutterIcon';
import ExplorerPlusIcon from 'components/Icons/ExplorerPlusIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import Input from 'components/ExplorerInput';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, {
  createRef,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SXStyles } from 'src/types';
import { Box, Flex } from 'theme-ui';
import { getParams } from 'util/url';
import useKeyPress from '../../../hooks/useKeyPress';
import { ContextMenu } from '../../ContextMenu';

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
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    width: '125px',
    paddingLeft: '8px',
  },
  button: {
    '&:hover': { borderRadius: '16px' },
    padding: '0px',
  },
  fileShutterOpened: {
    position: 'relative',
    right: '152px',
    bottom: '1px',
    transform: 'none',
    padding: '0px',
    '&:hover': {
      background: 'none',
    },
  },
  fileShutterClosed: {
    position: 'relative',
    right: '152px',
    bottom: '1px',
    padding: '0px',
    transform: 'rotate(180deg)',
    '&:hover': {
      background: 'none',
    },
  },
  icon: {
    paddingRight: '4px',
  },
  selectedIcon: {
    paddingRight: '4px',
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
    borderRadius: '4px',
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
};

type MenuListProps = {
  itemType: EntityType;
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
  itemType,
  items,
  onSelect,
  onUpdate,
  onInsert,
  // @ts-expect-error TODO: add template deletion
  onDelete,
}) => {
  const { active } = useProject();
  const isEditing = createRef<HTMLInputElement>();
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

  const location = useLocation();
  const params = getParams(location.search);

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.header}>
        <Flex sx={styles.headerTitle}>
          <Box>
            <ExplorerFileIcon />
          </Box>
          <Box sx={styles.titleText}>{title}</Box>
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
            const isDefault =
              params.id === undefined &&
              itemType === EntityType.ContractTemplate &&
              i === 0;
            const isActive =
              isDefault || (active.type === itemType && item.id === params.id);
            const dataTest = `sidebar-${item.title}`;
            const inputStyles = editing.includes(i)
              ? styles.input
              : styles.inputReadOnly;
            const submenuOptions = [
              {
                name: 'Edit name',
                onClick: () => toggleEditing(i, item.title),
              },
              {
                name: 'Delete File',
                onClick: () => {
                  onDelete({title: item.title, templateId: item.id})
                },
              },
            ];

            return (
              <Flex
                sx={isActive ? styles.selectedItem : styles.item}
                title={item.title}
                key={item.id}
                data-test={dataTest}
              >
                <Flex
                  sx={{ alignItems: 'center' }}
                  onClick={(e: React.SyntheticEvent<Element, Event>) =>
                    onSelect(e, item.id)
                  }
                >
                  <Box
                    className="menu-icon"
                    sx={isActive ? styles.selectedIcon : styles.icon}
                  >
                    {getIcon(item.title)}
                  </Box>
                  {/* NOTE: Optimize this to a controlled input! */}
                  <Input
                    editing={editing}
                    sx={inputStyles}
                    type="text"
                    defaultValue={item.title}
                    title={item.title}
                    index={i}
                    toggleEditing={toggleEditing}
                    onChange={(e: any) => {
                      if (e.target.value.length > NAME_MAX_CHARS) {
                        isEditing.current.value = e.target.value.substr(
                          0,
                          NAME_MAX_CHARS - 1,
                        );
                      }
                    }}
                  />
                </Flex>
                <ContextMenu options={submenuOptions} showEllipsis={isActive} />

                {/* TODO: Delete file, Update Filename userflows
                {!editing.includes(i) && isActive && items.length > 1 && (
                  <Box
                    onClick={}
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
