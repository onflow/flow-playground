import React, { useState, useRef } from "react";
import {HoverPanel} from "./styles";
import {Argument} from "./types";
import {ActionButton, ArgumentsList, ArgumentsTitle, Signers} from "components/Arguments/components";
import {EntityType} from "providers/Project";
import { motion } from "framer-motion";

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
  const constraintsRef = useRef(null);

  return(
    <>
      <div ref={constraintsRef} className="constraints"></div>
      <motion.div drag={true} className="drag-box" dragConstraints={constraintsRef} dragMomentum={false}>
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
      </motion.div>
    </>
  )
}

export default Arguments;