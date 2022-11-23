import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Input as ThemeUiInput } from 'theme-ui';

interface InputProps {
  onClick?: () => void;
  onChange?: (event: ChangeEvent) => void;
  value: string;
  type: string;
  index: number;
  editing: Array<number>;
  toggleEditing: any;
}

const styles: SXStyles = {
  input: {
    width: '100%',
    fontSize: '15px',
    color: '#69717E',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: '1px solid #dedede',
    pointerEvents: 'initial',
    background: '#FFFFFF',
    fontFamily: 'inherit',
    borderRadius: '4px',
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
  },
}

const Input = ({
  onClick,
  type,
  onChange,
  value,
  index,
  editing,
  toggleEditing,
}: InputProps) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const isEditingParent = editing.includes(index);
  const inputStyle = isEditingParent ? styles.input : styles.inputReadOnly;
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
