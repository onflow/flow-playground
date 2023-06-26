import React from 'react';
import { Argument } from 'components/Editor/CadenceEditor/ControlPanel/Arguments/types';
import { InputBlock, Input, Label, Type, Error } from './styles';

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
  return (
    <InputBlock>
      <Label>
        {name}
        <Type>{type}</Type>
      </Label>
      <Input
        name={`${name}-${type}`}
        disabled={unsupported}
        onChange={(event) => {
          const { value } = event.target;
          onChange(name, value);
        }}
      />
      {error && <Error>{error}</Error>}
    </InputBlock>
  );
};

export default SingleArgument;
