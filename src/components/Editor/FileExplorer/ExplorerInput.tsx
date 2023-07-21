import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Input as ThemeUiInput, useThemeUI } from 'theme-ui';

interface InputProps {
  onClick?: () => void;
  onChange?: (event: ChangeEvent) => void;
  value: string;
  type: string;
  index: number;
  editing: Array<number>;
  toggleEditing: any;
  hasError?: boolean;
}

const Input = ({
  onClick,
  type,
  onChange,
  value,
  index,
  editing,
  toggleEditing,
  hasError = false,
}: InputProps) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const isEditingParent = editing.includes(index);

  const context = useThemeUI();
  const { theme } = context;

  const styles: SXStyles = {
    input: {
      width: '100%',
      fontSize: '15px',
      color: `${theme.colors.text}`,
      fontWeight: '450',
      textOverflow: 'ellipsis',
      border: `1px solid ${theme.colors.border}`,
      pointerEvents: 'initial',
      background: `${theme.colors.background}`,
      fontFamily: 'inherit',
      borderRadius: '8px',
    },
    inputReadOnly: {
      width: '100%',
      fontSize: '15px',
      color: 'inherit',
      fontWeight: '450',
      textOverflow: 'ellipsis',
      border: '1px solid transparent',
      background: 'none',
      pointerEvents: 'none',
      fontFamily: 'inherit',
      borderRadius: '8px',
    },
    hasError: {
      borderColor: theme.colors.errorBackground,
      background: theme.colors.errorBackground,
    },
  };

  const inputStyle = {
    ...(isEditingParent ? styles.input : styles.inputReadOnly),
    ...(hasError ? styles.hasError : null),
  };
  const MAX_LENGTH = 50;

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        document.removeEventListener('click', handleClickOutside, true);
        toggleEditing(index, ref.current.value);
        setIsEditing(false);
      }
      return;
    };
    if (isEditingParent && !isEditing) {
      document.addEventListener('click', handleClickOutside, true);
      setIsEditing(true);
    }

    if (isEditingParent) {
      ref.current?.select();
      ref.current?.focus();
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      setIsEditing(false);
    };
  }, [editing]);

  return (
    <ThemeUiInput
      sx={inputStyle}
      ref={ref}
      onClick={onClick}
      type={type}
      onChange={onChange}
      readOnly={!isEditingParent && !isEditing}
      value={value}
      maxLength={MAX_LENGTH}
    />
  );
};

export default Input;
