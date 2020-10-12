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
  console.log({expanded})
  return (
    <Heading>
      <Title>
        {type === EntityType.Account && "Contract Arguments"}
        {type === EntityType.TransactionTemplate && "Transaction Arguments"}
        {type === EntityType.ScriptTemplate && "Script Arguments"}
      </Title>
      <Controls>
        {errors > 0 && <Badge><span>{errors}</span></Badge>}
        <ToggleExpand className="icon" active={expanded} onClick={()=>setExpanded(!expanded)} />
      </Controls>
    </Heading>
  );
};

export const ArgumentsList: React.FC<ArgumentsListProps> = ({list}) =>{
  return(
    <List>
      {list.map(({name, type})=>{
        return (name && type)
          ? <SingleArgument key={name} name={name} type={type}/>
          : null
      })}
    </List>
  )
}

const getLabel = (type: EntityType) => {
  switch (true){
    case type === EntityType.Account:
      return "Deploy"
      break;
    case type === EntityType.TransactionTemplate:
      return "Send"
      break;
    case type === EntityType.ScriptTemplate:
      return "Execute"
      break;
    default:
      return "Send"
  }
}

export const ActionButton: React.FC<InteractionButtonProps> = ({type, onClick}) => {

  const label = getLabel(type);
  const { isSavingCode } = useProject();
  // const [sendingTransaction, setSendingTransaction] = useState(false);
  const sendingTransaction = false;

  return (
    <Controls>
      <Button
        onClick={onClick}
        Icon={FaArrowCircleRight}
        disabled={isSavingCode}
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
    </SignersContainer>
  )
}