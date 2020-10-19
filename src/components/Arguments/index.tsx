import React, { useState, useRef } from "react";
import {HoverPanel} from "./styles";
import {Argument} from "./types";
import {ActionButton, ArgumentsList, ArgumentsTitle, Signers} from "./components";
import {EntityType} from "providers/Project";
import { motion } from "framer-motion";

type ArgumentsProps = {
  type: EntityType,
  list: Argument[],
  signers: number
}

const validateByType = (value: any, type: string) => {
  if (value.length === 0){
    return "Value can't be empty"
  }

  switch (true){
    // Strings
    case type === "String":{
      return null // no need to validate String for now
    }

    // Integers
    case type.includes("Int"):{
      if (isNaN(value)){
        return "Should be a valid Integer number"
      }
      return null
    }

    // Words
    case type.includes("Word"):{
      if (isNaN(value)){
        return "Should be a valid Word number"
      }
      return null
    }

    // Fixed Point
    case type.includes("Fix"):{
      if (isNaN(value)){
        return "Should be a valid fixed point number"
      }
      return null
    }

    // Address
    case type === "Address":{
      if (!value.match(/(^0x[\w\d]{16})|(^0x[\w\d]{1,4})/)){
        return "Not a valid Address"
      }
      return null
    }

    // Booleans
    case type === "Bool":{
      if (value !== "true" && value !== "false"){
        return "Boolean values can be either true or false"
      }
      return null
    }

    default:
      return null
  }
}

const validate = (list:any, values:any) => {
  console.log({list, values})

  const result = list.reduce(( acc: any, item: any )=>{
    const { name, type } = item
    const value = values[name]
    if (value){
      console.log(`${name} : ${value} should be of type ${type}`)
      const error = validateByType(value, type)
      if (error){
        acc[name] = error
      }
    }
    return acc;
  },{})

  console.log(result);
  return result
}

const Arguments: React.FC<ArgumentsProps> = (props) => {
  const { type, list, signers } = props;
  const needSigners = type == EntityType.TransactionTemplate && signers > 0
  const [ selected, updateSelectedAccounts ] = useState([])
  const [ expanded, setExpanded ] = useState(true)
  const constraintsRef = useRef(null)
  const [values, setValue] = useState({})
  const errors = validate(list, values)
  const numberOfErrors = Object.keys(errors).length;
  const haveErrors = numberOfErrors > 0
  return(
    <>
      <div ref={constraintsRef} className="constraints"></div>
      <motion.div drag={true} className="drag-box" dragConstraints={constraintsRef} dragMomentum={false}>
        <HoverPanel>
          {list.length > 0 &&
            <>
              <ArgumentsTitle
                type={type}
                errors={numberOfErrors}
                toggleExpand={()=>{console.log("expand")}}
                expanded={expanded}
                setExpanded={setExpanded}
              />
              {expanded && <ArgumentsList list={list} errors={errors} onChange={(name, value)=>{
                let key = name.toString();
                let newValue = {...values, [key]: value};
                setValue(newValue);
              }}/>}
            </>
            }
          {needSigners && <Signers maxSelection={signers} selected={selected} updateSelectedAccounts={updateSelectedAccounts}/>}
          <ActionButton active={!haveErrors} type={type} onClick={()=>{console.log("GO!")}}/>
        </HoverPanel>
      </motion.div>
    </>
  )
}

export default Arguments;