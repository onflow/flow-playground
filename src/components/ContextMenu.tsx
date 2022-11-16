import React, { useEffect, useRef, useState } from 'react';
import ExplorerEllipseIcon from './Icons/ExplorerEllipseIcon';
import Button from 'components/Button';
import { Container, Flex, Text } from 'theme-ui';
import { SXStyles } from 'src/types';
import theme from '../theme';

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

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  menuRelative: {
    position: 'relative',
  },
  menuAbsolute: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.borderColor}`,
    boxShadow: `0px 4px 40px rgba(0, 0, 0, 0.08)`,
    position: 'absolute',
    zIndex: '100',
    margin: '0',
    right: '5px',
    bottom: '12px',
    background: theme.colors.white,
    padding: '1rem',
  },
  ctaButton: {
    alignSelf: 'baseline',
    padding: '0px 8px 0px 0px',
    '&:hover': {
      background: 'none',
    },
  },
  ctaOption: {
    backgroundColor: theme.colors.white,
    padding: '0.25rem',
    whiteSpace: 'nowrap',
    '&:hover': {
      color: theme.colors.darkGrey,
    },
  },
};

export const ContextMenu = ({ options, showEllipsis }: ContextMenuType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      {isOpen && (
        <Flex sx={styles.menuRelative}>
          <Flex sx={styles.menuAbsolute}>
            {options.map(
              ({ icon, name, onClick, args }: ContextMenuOptionsType) => (
                <Button
                  sx={styles.ctaOption}
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
      )}
    </Container>
  );
};
