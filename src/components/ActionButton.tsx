import React from "react";
import { motion } from "framer-motion";
import { CSSProperties } from 'styled-components';
import Button from './Button';

interface ActionButtonProps {
  children?: any,
  onClick?: any,
  className?: string,
  style?: CSSProperties,
  Icon?: any,
  isLoading?: boolean,
  isActive?: boolean,
};

const ActionButton: React.FC<ActionButtonProps> = props => {
  return (
    <motion.div sx={{display: "flex", justifyContent: "center", alignItems: "center"}} whileTap={{ scale: 0.95 }}>
      <Button {...props}>{props.children}</Button>
    </motion.div>
  );
};

export default ActionButton;
