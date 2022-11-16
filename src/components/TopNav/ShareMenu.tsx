import React, { useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Flex } from 'theme-ui';
import theme from '../../theme';


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
}

export const ShareMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return(
    <Flex>
      hello
    </Flex>
  )
}