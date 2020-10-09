import React from "react";
import { EntityType } from "providers/Project";
import { Badge, Controls, Heading, List, Title } from "./styles";
import {ArgumentsListProps, ArgumentsTitleProps, InteractionButtonProps} from "./types";
import SingleArgument from "./SingleArgument";
import Button from "components/Button";
import {FaArrowCircleRight} from "react-icons/fa";

export const ArgumentsTitle: React.FC<ArgumentsTitleProps> = ({ type, errors }) => {
  return (
    <Heading>
      <Title>
        {type === EntityType.Account && "Contract Arguments"}
        {type === EntityType.TransactionTemplate && "Transaction Arguments"}
        {type === EntityType.ScriptTemplate && "Script Arguments"}
      </Title>
      <Controls>
        {errors > 0 && <Badge><span>{errors}</span></Badge>}
      </Controls>
    </Heading>
  );
};

export const ArgumentsList: React.FC<ArgumentsListProps> = ({list}) =>{
  return(
    <List>
      {list.map(({name, type})=>{
        return(
          <SingleArgument key={name} name={name} type={type}/>
        )
      })}
    </List>
  )
}

export const ActionButton: React.FC<InteractionButtonProps> = ({type, onClick}) => {
  let label;
  switch (true){
    case type === EntityType.Account:
      label = "Deploy"
      break;
    case type === EntityType.TransactionTemplate:
      label = "Send"
      break;
    case type === EntityType.ScriptTemplate:
      label = "Execute"
      break;
    default:
      label = "Send"
  }
  return (
    <Controls>
      <Button onClick={onClick} Icon={FaArrowCircleRight}>
        {label}
      </Button>
    </Controls>
  );
};