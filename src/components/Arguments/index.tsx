import React, {useState} from "react";
import {HoverPanel} from "./styles";
import {Argument} from "./types";
import {ActionButton, ArgumentsList, ArgumentsTitle, Signers} from "components/Arguments/components";
import {EntityType} from "providers/Project";

type ArgumentsProps = {
  type: EntityType,
  list: Argument[],
  signers: number
}

const Arguments: React.FC<ArgumentsProps> = (props) => {
  const { type, list, signers } = props;
  const needSigners = type == EntityType.TransactionTemplate && signers > 0
  const [ selected, updateSelectedAccounts ] = useState([])
  const [ expanded, setExpanded ] = useState(true)
  return(
    <HoverPanel>
      {list.length > 0 &&
        <>
          <ArgumentsTitle
            type={type}
            errors={3}
            toggleExpand={()=>{console.log("expand")}}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          {expanded && <ArgumentsList list={list}/>}
        </>
        }
      {needSigners && <Signers maxSelection={signers} selected={selected} updateSelectedAccounts={updateSelectedAccounts}/>}
      <ActionButton type={type} onClick={()=>{console.log("GO!")}}/>
    </HoverPanel>
  )
}

export default Arguments;