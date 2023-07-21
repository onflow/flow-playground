import React from 'react';
import { Argument } from 'components/Editor/CadenceEditor/ControlPanel/Arguments/types';
import { InputBlock, Input, Label, Type, Error } from './styles';
import { useThemeUI } from 'theme-ui';

type SingleArgumentProps = {
  argument: Argument;
  error: String;
  onChange: (name: String, value: any) => void;
};

const SingleArgument: React.FC<SingleArgumentProps> = ({
  argument,
  error,
  onChange,
}) => {
  const { name, type, unsupported } = argument;
  const context = useThemeUI();
  const { theme } = context;

  return (
    <InputBlock>
      <Label theme={theme}>
        {name}
        <Type theme={theme}>{type}</Type>
      </Label>
      <Input
        theme={theme}
        name={`${name}-${type}`}
        disabled={unsupported}
        onChange={(event) => {
          const { value } = event.target;
          onChange(name, value);
        }}
      />
      {error && <Error theme={theme}>{error}</Error>}
    </InputBlock>
  );
};

export default SingleArgument;
