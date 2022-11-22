import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Input as ThemeUiInput, ThemeUICSSObject } from 'theme-ui';

interface NavInputProps {
  onChange?: (event: ChangeEvent) => void;
  defaultValue: string;
  value: string
  sx?: ThemeUICSSObject;
  type: string;
  'data-test'?: string;
  editing: boolean;
  setTopNavEditing: any;
  updateProjectName: any;
}

const NavInput = ({
  onChange,
  defaultValue,
  value,
  sx = {},
  type,
  'data-test': dataTest,
  editing,
  setTopNavEditing,
  updateProjectName,
}: NavInputProps) => {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log(event)
        console.log('saving on outsideclick navinput projectnanme ' + value)
        document.removeEventListener('click', handleClickOutside, true);
        updateProjectName(value);
        setTopNavEditing(false);
        setIsEditing(false);
      }
    };
    if (editing && !isEditing) {
      document.addEventListener('click', handleClickOutside, true);
      setIsEditing(true);
    }
  }, [editing]);
  return (
    <ThemeUiInput
      sx={sx}
      ref={ref}
      type={type}
      onChange={onChange}
      readOnly={editing}
      value={value}
      defaultValue={defaultValue}
      data-test={dataTest}
    />
  );
};

export default NavInput;
