import React from "react";
import { Hover } from "./styles";
import { Argument } from "./types";
import {ArgumentsTitle, ArgumentsList, ActionButton} from "components/Arguments/components";
import { EntityType } from "providers/Project";

type ArgumentsProps = {
  type: EntityType,
  list: Argument[]
}

const Arguments: React.FC<ArgumentsProps> = ({type, list}) => {
  return(
    <Hover>
      <ArgumentsTitle
        type={type}
        errors={3}
        toggleExpand={()=>{console.log("expand")}}
        expanded={false}/>
      {list.length > 0 && <ArgumentsList list={list}/>}
      <ActionButton type={type} onClick={()=>{console.log("GO!")}}/>
    </Hover>
  )
}

export default Arguments;