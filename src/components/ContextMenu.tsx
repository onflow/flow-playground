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
  icon: Function;
};

type ContextMenuType = {
  options: ContextMenuOptionsType[];
  showDotDotDot: boolean;
};

const styles: SXStyles = {
  container: {
    margin: '0',
    width: 'unset',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    border: `1px solid ${theme.colors.borderColor}`,
    boxShadow: `0px 4px 40px rgba(0, 0, 0, 0.08)`,
    position: 'absolute',
    zIndex: '11',
    left: '150px',
    margin: '0',
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

export const ContextMenu = ({ options, showDotDotDot }: ContextMenuType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const clickOption = (onClick: Function, args: any[] = []) => {
    setIsOpen(false);
    onClick(...args);
  };

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ ]);

  if (!showDotDotDot) return null;

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
        <Flex sx={styles.menu}>
          {options.map(
            ({ icon, name, onClick, args }: ContextMenuOptionsType) => (
              <Button sx={styles.ctaOption} key={name} onClick={() => clickOption(onClick, args)}>
                {icon()}
                <Text>{name}</Text>
              </Button>
            ),
          )}
        </Flex>
      )}
    </Container>
  );
};
