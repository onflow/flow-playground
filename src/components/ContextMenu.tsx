import React, { useEffect, useRef, useState } from 'react';
import ExplorerEllipseIcon from './Icons/ExplorerEllipseIcon';
import Button from 'components/Button';
import { Container, Flex, Text, useThemeUI } from 'theme-ui';
import { SXStyles } from 'src/types';

type ContextMenuOptionsType = {
  name: string;
  onClick: Function;
  args?: any[];
  icon?: Function | undefined;
};

type ContextMenuType = {
  options: ContextMenuOptionsType[];
  showEllipsis: boolean;
};

export const ContextMenu = ({ options, showEllipsis }: ContextMenuType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    container: {
      margin: '0',
      width: 'unset',
    },
    menuRelative: {
      position: 'relative',
      visibility: isOpen ? 'visible' : 'hidden',
    },
    menuAbsolute: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      boxShadow: `0px 4px 20px ${theme.colors.shadow}`,
      position: 'absolute',
      zIndex: '100', // todo: create zIndex constant in theme object
      margin: '0',
      right: '0',
      bottom: '22px',
      background: theme.colors.background,
      padding: '4px 4px',
      whiteSpace: 'nowrap',
    },
    ctaButton: {
      alignSelf: 'baseline',
      padding: '0px 8px',
      maxHeight: '10px',
      background: 'none',
      '&:hover': {
        background: 'none',
      },
    },
    ctaOption: {
      padding: '8px 12px',
    },
  };

  const clickOption = (onClick: Function, args: any[] = []) => {
    setIsOpen(false);
    onClick(...args);
  };

  const getIcon = (icon: Function) => {
    if (icon) {
      return icon();
    }
    return;
  };

  const ref = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  if (!showEllipsis) return null;

  if (isOpen) {
    const rect = menuRef?.current?.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const top = rect.top + scrollTop;
    if (top < 0) {
      menuRef.current.style.bottom = `-${rect.height}px`;
    }
  }
  return (
    <Container sx={styles.container} ref={ref}>
      <Button
        sx={styles.ctaButton}
        inline={true}
        variant="explorer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {ExplorerEllipseIcon()}
      </Button>
      <Flex sx={styles.menuRelative}>
        <Flex sx={styles.menuAbsolute} ref={menuRef}>
          {options.map(
            ({ icon, name, onClick, args }: ContextMenuOptionsType) => (
              <Button
                sx={styles.ctaOption}
                variant="explorer"
                key={name}
                onClick={() => clickOption(onClick, args)}
              >
                {getIcon(icon)}
                <Text>{name}</Text>
              </Button>
            ),
          )}
        </Flex>
      </Flex>
    </Container>
  );
};
