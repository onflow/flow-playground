import React, { ChangeEvent, ForwardedRef } from 'react';
import { Input as ThemeUiInput, ThemeUICSSObject } from 'theme-ui';

interface InputProps {
  onClick?: () => void;
  onBlur?: (event: any) => void;
  onChange?: (event: ChangeEvent) => void;
  readOnly?: boolean;
  defaultValue: string;
  sx?: ThemeUICSSObject;
  type: string;
  'data-test'?: string;
  ref: ForwardedRef<any>;
}

const getStyles = () => ({
  root: {
    background: '#FFFFF',
    border: '1px solid #ABB3BF',
    borderRadius: '4px',
  },
});

const Input = ({
  onClick,
  sx = {},
  'data-test': dataTest,
  type,
  onBlur,
  onChange,
  readOnly,
  defaultValue,
  ref,
}: InputProps) => {
  const styles = getStyles();
  const mergedSx = { ...styles.root, ...sx };
  return (
    <ThemeUiInput
      sx={mergedSx}
      onClick={onClick}
      type={type}
      onBlur={onBlur}
      onChange={onChange}
      readOnly={readOnly}
      defaultValue={defaultValue}
      ref={ref}
      data-test={dataTest}
    />
  );
};

export default Input;
