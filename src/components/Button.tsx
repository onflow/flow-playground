import React from 'react';
import { ChildProps } from 'src/types';
import { Button as ThemeUiButton, ThemeUICSSObject } from 'theme-ui';

type ButtonSizes = 'sm' | 'md' | 'lg';

interface ButtonProps extends ChildProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled' | 'alternate' | 'link';
  size?: ButtonSizes;
  submit?: boolean;
  disabled?: boolean;
  sx?: ThemeUICSSObject;
}

const getStyles = (disabled: boolean) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    '&:hover': {
      cursor: disabled ? 'default' : 'pointer',
    },
  },
});

const sizeStyles: Record<ButtonSizes, ThemeUICSSObject> = {
  sm: {
    height: 34,
    py: 2,
    px: 4,
    fontSize: 1,
    color: 'text',
    borderRadius: '4px',
  },
  md: {},
  lg: {},
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  submit,
  disabled,
  sx = {},
}: ButtonProps) => {
  const styles = getStyles(disabled);
  const mergedSx = { ...styles.root, ...sizeStyles[size], ...sx };
  return (
    <ThemeUiButton
      sx={mergedSx}
      onClick={onClick}
      disabled={disabled}
      type={submit ? 'submit' : 'button'}
      variant={variant}
    >
      {children}
    </ThemeUiButton>
  );
};

export default Button;
