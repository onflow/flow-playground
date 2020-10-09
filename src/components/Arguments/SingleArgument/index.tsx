import React from "react";
import { Argument } from "components/Arguments/types";
import { Container, Input, Label, Type } from "./styles";

const SingleArgument: React.FC<Argument> = ({name, type}) => {
  return (
    <Container>
      <Label>
        {name}
        <Type>{type}</Type>
      </Label>
      <Input/>
    </Container>
  )
}

export default SingleArgument
