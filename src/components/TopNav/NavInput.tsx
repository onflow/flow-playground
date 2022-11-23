import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SXStyles } from 'src/types';
import { Input as ThemeUiInput } from 'theme-ui';

interface NavInputProps {
  onChange?: (event: ChangeEvent) => void;
  value: string;
  type: string;
  updateValue: any;
}

const styles: SXStyles = {
  input: {
    width: '100%',
    fontSize: '15px',
    color: '#000000',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    border: 'none',
    pointerEvents: 'initial',
    background: '#DEE2E9',
    backgroundColor: '#DEE2E9',
    fontFamily: 'Termina',
    textAlign: 'center',
    borderRadius: '0px',
  },
  inputReadOnly: {
    width: '100%',
    fontSize: '15px',
    border: 'none',
    color: 'inherit',
    fontWeight: '450',
    textOverflow: 'ellipsis',
    background: 'none',
    fontFamily: 'Termina',
    textAlign: 'center',
    borderRadius: '0px',
  },
};

const NavInput = ({ onChange, value, type, updateValue }: NavInputProps) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputStyle = isEditing ? styles.input : styles.inputReadOnly;
  const MAX_LENGTH = 50;

  const openEditing = () => {
    if (!isEditing) {
      setIsEditing(!isEditing);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const clicked = !ref.current.contains(event.target);
      if (ref.current && clicked) {
        document.removeEventListener('click', handleClickOutside, true);
        updateValue(ref.current.value);
        setIsEditing(false);
      }
    };
    if (isEditing) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return;
  }, [isEditing]);

  return (
    <ThemeUiInput
      onClick={openEditing}
      sx={inputStyle}
      ref={ref}
      readOnly={!isEditing}
      type={type}
      onChange={onChange}
      value={value}
      maxLength={MAX_LENGTH}
    />
  );
};

export default NavInput;
