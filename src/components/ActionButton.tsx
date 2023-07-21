import { motion } from 'framer-motion';
import React from 'react';
import Button from './Button';
import { ButtonProps } from './Button';

const OpenProjectButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button {...props}>{props.children}</Button>
    </motion.div>
  );
};

export default OpenProjectButton;
