import { useLocation } from '@reach/router';
import Button from 'components/Button';
import ExplorerContractIcon from 'components/Icons/ExplorerContractIcon';
import ExplorerFileIcon from 'components/Icons/ExplorerFileIcon';
import ExplorerFileShutterIcon from 'components/Icons/ExplorerFileShutterIcon';
import ExplorerPlusIcon from 'components/Icons/ExplorerPlusIcon';
import ExplorerScriptIcon from 'components/Icons/ExplorerScriptIcon';
import ExplorerTransactionIcon from 'components/Icons/ExplorerTransactionIcon';
import Input from './ExplorerInput';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { SXStyles, Template } from 'src/types';
import { Box, Flex, useThemeUI } from 'theme-ui';
import { getParams } from 'util/url';
import { ContextMenu } from '../../ContextMenu';
import PencilIcon from 'components/Icons/PencilIcon';
import DeleteIcon from 'components/Icons/DeleteIcon';
import {
  findDuplicateIndex,
  hasDuplicates,
  isMobile,
} from '../CadenceEditor/ControlPanel/utils';

type MenuListProps = {
  itemType: EntityType;
  title?: string;
  items: Template[];
  itemTitles: any[];
  onSelect: (e: SyntheticEvent, id: string) => void;
  onUpdate: any;
  onInsert: () => Promise<void>;
  onDelete: ({
    itemType,
    templateId,
  }: {
    itemType: EntityType;
    templateId: string;
  }) => void;
};

const MenuList: React.FC<MenuListProps> = ({
  title,
  itemType,
  items,
  itemTitles,
  onSelect,
  onUpdate,
  onInsert,
  onDelete,
}) => {
  const { active } = useProject();
  const [editing, setEditing] = useState([]);
  const [itemNames, setItemNames] = useState(itemTitles);
  const [indexHasError, setIndexHasError] = useState(-1);
  const [isInserting, setIsInserting] = useState(false);
  const [isFileShuttered, setIsFileShuttered] = useState(false);
  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '100%',
      letterSpacing: '-0.02em',
      alignItems: 'start',
      fontFamily: 'IBM Plex Mono',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      margin: '4px 0',
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
      '&:hover': { borderRadius: '8px' },
      padding: '0px',
    },
    fileShutterOpened: {
      position: 'relative',
      right: '160px',
      bottom: '1px',
      transform: 'none',
      padding: '0px',
      '&:hover': {
        background: 'none',
      },
    },
    fileShutterClosed: {
      position: 'relative',
      right: '160px',
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
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
      justifyContent: 'start',
      margin: '6px 0 6px 6px',
      paddingLeft: '16px',
      fontFamily: 'inherit',
      '&:hover': {
        background: `${theme.colors.accent}`,
        borderRadius: '8px',
        cursor: 'pointer',
        color: `${theme.colors.active}`,
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
      margin: '6px 0 6px 6px',
      paddingLeft: '16px',
      paddingRight: '8px',
      background: `${theme.colors.accent}`,
      color: `${theme.colors.active}`,
      borderRadius: '8px',
    },
    centerAlign: {
      alignItems: 'center',
    },
    hasError: {
      background: theme.colors.errorBackground,
    },
  };

  const toggleFileShutter = () => {
    setIsFileShuttered(!isFileShuttered);
  };

  const toggleEditing = (i: number, newTitle: string) => {
    if (editing.includes(i)) {
      let _editing = [...editing];
      _editing.splice(_editing.indexOf(i), 1);
      setEditing(_editing);
      items[i].title = newTitle;
      onUpdate(items[i].id, items[i].script, newTitle);
      return;
    }
    return setEditing([...editing, i]);
  };

  const setItemName = (name: string, index: number) => {
    setIndexHasError(-1);
    let _newNames = [...itemNames];
    if (itemNames.indexOf(index)) {
      _newNames.splice(index, 1, name);
      setItemNames(_newNames);
    }
    if (hasDuplicates(_newNames)) {
      setIndexHasError(index);
    }
  };

  useEffect(() => {
    setIndexHasError(-1);
    setItemNames(itemTitles);
    if (hasDuplicates(itemTitles)) {
      setIndexHasError(findDuplicateIndex(itemTitles));
    }
  }, [itemTitles]);

  const getIcon = (type: EntityType) => {
    switch (type) {
      case EntityType.TransactionTemplate:
        return <ExplorerTransactionIcon />;
      case EntityType.ScriptTemplate:
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
        {!!onInsert && !isMobile() && (
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
              params.storage === undefined &&
              itemType === EntityType.ContractTemplate &&
              i === 0;
            const isActive =
              isDefault || (active.type === itemType && item.id === params.id);
            const hasError = indexHasError === i;
            const submenuOptions = [
              {
                icon: PencilIcon,
                name: 'Edit name',
                onClick: () => toggleEditing(i, item.title),
              },
              {
                icon: DeleteIcon,
                name: 'Delete File',
                onClick: () => {
                  onDelete({ itemType, templateId: item.id });
                },
              },
            ];

            return (
              <Flex
                sx={{
                  ...(isActive ? styles.selectedItem : styles.item),
                  ...(hasError ? styles.hasError : {}),
                }}
                title={item.title}
                key={item.id}
              >
                <Flex
                  sx={styles.centerAlign}
                  onClick={(e: React.SyntheticEvent<Element, Event>) =>
                    onSelect(e, item.id)
                  }
                >
                  <Box
                    className="menu-icon"
                    sx={isActive ? styles.selectedIcon : styles.icon}
                  >
                    {getIcon(itemType)}
                  </Box>
                  {/* NOTE: Optimize this to a controlled input! */}
                  <Input
                    editing={editing}
                    type="text"
                    value={itemNames[i]}
                    index={i}
                    toggleEditing={toggleEditing}
                    onChange={(e: any) => {
                      setItemName(e.target.value, i);
                    }}
                    hasError={hasError}
                  />
                </Flex>
                <ContextMenu options={submenuOptions} showEllipsis={isActive} />
              </Flex>
            );
          })}
        </Box>
      )}
    </Flex>
  );
};

export default MenuList;
