import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { EntityType } from "providers/Project";
import Button from "components/Button";
import { useProject } from "providers/Project/projectHooks";
import AccountPicker from "components/AccountPicker";
import { Badge, Controls, Heading, List, Title, SignersContainer, ToggleExpand } from "./styles";
import { ArgumentsListProps, ArgumentsTitleProps, InteractionButtonProps } from "./types";
import SingleArgument from "./SingleArgument";

export const ArgumentsTitle: React.FC<ArgumentsTitleProps> = (props) => {
  const { type, errors, expanded, setExpanded } = props
  return (
    <Heading>
      <Title>
        {type === EntityType.Account && "Contract Arguments"}
        {type === EntityType.TransactionTemplate && "Transaction Arguments"}
        {type === EntityType.ScriptTemplate && "Script Arguments"}
      </Title>
      <Controls>
        {errors > 0 && <Badge><span>{errors}</span></Badge>}
        <ToggleExpand className="icon" expanded={expanded} onClick={()=>setExpanded(!expanded)} />
      </Controls>
    </Heading>
  );
};

export const ArgumentsList: React.FC<ArgumentsListProps> = ({list, errors, onChange, hidden}) =>{
  return(
    <List hidden={hidden}>
      {list.map((argument)=>{
        const {name, type} = argument
        const error = errors[name]
        return (name && type)
          ? <SingleArgument key={name} argument={argument} onChange={onChange} error={error}/>
          : null
      })}
    </List>
  )
}

const getLabel = (type: EntityType) => {
  const { project, active } = useProject();
  const { accounts } = project;

  switch (true){
    case type === EntityType.Account:
      return accounts[active.index].deployedCode
          ? "Redeploy"
          : "Deploy"
    case type === EntityType.TransactionTemplate:
      return "Send"
    case type === EntityType.ScriptTemplate:
      return "Execute"
    default:
      return "Send"
  }
}

export const ActionButton: React.FC<InteractionButtonProps> = ({type, active = true, onClick}) => {

  const label = getLabel(type);
  const { isSavingCode } = useProject();
  const sendingTransaction = false;

  return (
    <Controls>
      <Button
        onClick={onClick}
        Icon={FaArrowCircleRight}
        disabled={isSavingCode || !active}
        isLoading={sendingTransaction}>
          {label}
      </Button>
    </Controls>
  );
};

type SignersProps = {
  maxSelection? : number;
  selected: number[];
  updateSelectedAccounts: (selection: number[]) => void;
}

export const Signers: React.FC<SignersProps> = (props) => {
  const {
    project
  } = useProject();
  const { accounts } = project;

  const { maxSelection, selected, updateSelectedAccounts } = props;
  return(
    <SignersContainer>
      <Title>Transaction Signers</Title>
      <AccountPicker
        project={project}
        accounts={accounts}
        selected={selected}
        onChange={updateSelectedAccounts}
        maxSelection={maxSelection}
      />
      {selected.length < maxSelection && <p>Not enough signers...</p>}
    </SignersContainer>
  )
}
