import React, { ChangeEvent, ForwardedRef, useEffect, useRef, useState } from 'react';
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
  title: string;
  index: number;
  editing: Array<number>;
  toggleEditing: any;
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
  index,
  title,
  editing,
  toggleEditing,
}: InputProps) => {
  const styles = getStyles();
  const mergedSx = { ...styles.root, ...sx };
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      console.log('effect hit')
      if (ref.current && !ref.current.contains(event.target)) {
        document.removeEventListener('click', handleClickOutside, true);
        toggleEditing(index, title)
        setIsEditing(false)
      }
      return
    };
    if (editing.includes(index) && !isEditing) {
      document.addEventListener('click', handleClickOutside, true);
      setIsEditing(true);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      setIsEditing(false)
    };
  }, [editing]);

  return (
    <ThemeUiInput
      sx={mergedSx}
      ref={ref}
      onClick={onClick}
      type={type}
      onBlur={onBlur}
      onChange={onChange}
      readOnly={readOnly}
      defaultValue={defaultValue}
      data-test={dataTest}
    />
  );
};

export default Input;
