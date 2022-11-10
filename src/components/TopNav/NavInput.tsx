import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input as ThemeUiInput, ThemeUICSSObject } from 'theme-ui';

interface InputProps {
  onChange?: (event: ChangeEvent) => void;
  defaultValue: string;
  sx?: ThemeUICSSObject;
  type: string;
  'data-test'?: string;
  editing: boolean;
  toggleEditing: any;
  updateProjectName: any;
}

const Input = ({
  onChange,
  defaultValue,
  sx = {},
  type,
  'data-test': dataTest,
  editing,
  toggleEditing,
  updateProjectName,
}: InputProps) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        document.removeEventListener('click', handleClickOutside, true);
        updateProjectName();
        toggleEditing();
        setIsEditing(false);
      }
    };
    if (editing && !isEditing) {
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
      sx={sx}
      ref={ref}
      type={type}
      onChange={onChange}
      readOnly={editing}
      defaultValue={defaultValue}
      data-test={dataTest}
    />
  );
};

export default Input;
