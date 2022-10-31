import React from 'react';
import { ChildProps } from 'src/types';
import { Button as ThemeUiButton, ThemeUICSSObject } from 'theme-ui';

type ButtonSizes = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ChildProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'secondaryLegacy'
    | 'disabled'
    | 'alternate'
    | 'link';
  size?: ButtonSizes;
  submit?: boolean;
  disabled?: boolean;
  sx?: ThemeUICSSObject;
  'data-test'?: string;
  hideDisabledState?: boolean;
  inline?: boolean;
}

const getStyles = (disabled: boolean, inline?: boolean) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: inline ? 'auto' : '100%',
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
    borderRadius: '4px',
  },
  md: {
    px: 14,
    py: 8,
    fontSize: 1,
    fontWeight: 600,
  },
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
  'data-test': dataTest,
  hideDisabledState,
  inline,
}: ButtonProps) => {
  const styles = getStyles(disabled, inline);
  const mergedSx = { ...styles.root, ...sizeStyles[size], ...sx };
  const showDisabledState = disabled && !hideDisabledState;
  return (
    <ThemeUiButton
      sx={mergedSx}
      onClick={onClick}
      disabled={disabled}
      type={submit ? 'submit' : 'button'}
      variant={showDisabledState ? 'disabled' : variant}
      data-test={dataTest}
    >
      {children}
    </ThemeUiButton>
  );
};

export default Button;
