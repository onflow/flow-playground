import { motion } from 'framer-motion';
import React from 'react';
import { ChildPropsOptional } from 'src/types';
import { CSSProperties } from 'styled-components';
import LegacyButton from './LegacyButton';

interface ActionButtonProps extends ChildPropsOptional {
  onClick?: any;
  className?: string;
  style?: CSSProperties;
  Icon?: any;
  isLoading?: boolean;
  isActive?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <LegacyButton {...props}>{props.children}</LegacyButton>
    </motion.div>
  );
};

export default ActionButton;
