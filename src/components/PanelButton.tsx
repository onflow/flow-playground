import { motion } from 'framer-motion';
import React from 'react';
import theme from '../theme';
import { ChildPropsOptional } from 'src/types';
import { CSSProperties } from 'styled-components';
import Button from './Button';
import CheckMarkIcon from './Icons/CheckMark';

interface PanelButtonProps extends ChildPropsOptional {
  onClick?: any;
  className?: string;
  style?: CSSProperties;
  Icon?: any;
  isLoading?: boolean;
  isComplete?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  hideDisabledState?: boolean;
  'data-test'?: string;
}

const PanelButton: React.FC<PanelButtonProps> = (props) => {
    // TODO: what is hideDisabledState used for

    const getStyle = ({disabled, isComplete}: PanelButtonProps) => {
        if (disabled) return theme.colors.grey;
        if (isComplete) return theme.colors.primary;
        return theme.colors.black
    }

    const sx = {
        ...props.style,
        backgroundColor: getStyle(props),
        color: theme.colors.white,
    }

  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button {...props} sx={sx} disabled={props.disabled || props.hideDisabledState}>{props.isComplete && CheckMarkIcon()}{props.children}</Button>
    </motion.div>
  );
};

export default PanelButton;
