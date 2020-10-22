import React, {useRef, useState} from "react";
import {FaRegCheckCircle, FaRegTimesCircle, FaSpinner} from "react-icons/fa";
import {motion} from "framer-motion";
import {EntityType} from "providers/Project";
import {useProject} from "providers/Project/projectHooks";
import {Account, ResultType, useSetExecutionResultsMutation} from "api/apollo/generated/graphql";
import {ControlContainer, HoverPanel, StatusMessage} from "./styles";
import {Argument} from "./types";
import {ActionButton, ArgumentsList, ArgumentsTitle, Signers} from "./components";

type ArgumentsProps = {
  type: EntityType,
  list: Argument[],
  signers: number,
  validCode: boolean
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

  const result = list.reduce(( acc: any, item: any )=>{
    const { name, type } = item
    const value = values[name]
    if (value){
      const error = validateByType(value, type)
      if (error){
        acc[name] = error
      }
    }
    return acc;
  },{})

  return result
}

type ScriptExecution = (args?: string[]) => Promise<any>;
type TransactionExecution = (signingAccounts: Account[], args?: string[]) => Promise<any>;
type DeployExecution = () => Promise<any>;

type ProcessingArgs = {
  disabled: boolean,
  scriptFactory?: ScriptExecution,
  transactionFactory?: TransactionExecution,
  contractDeployment?: DeployExecution
}

const useTemplateType = (): ProcessingArgs => {
  const { isSavingCode } = useProject();
  const { createScriptExecution, createTransactionExecution, updateAccountDeployedCode } = useProject();

  return {
    disabled: isSavingCode,
    scriptFactory: createScriptExecution,
    transactionFactory: createTransactionExecution,
    contractDeployment: updateAccountDeployedCode
  }
}

interface IValue {
  [key: string]: string
}

const Arguments: React.FC<ArgumentsProps> = (props) => {
  const { type, list, signers, validCode } = props;
  const needSigners = type == EntityType.TransactionTemplate && signers > 0
  const [ selected, updateSelectedAccounts ] = useState([])
  const [ expanded, setExpanded ] = useState(true)
  const constraintsRef = useRef(null)
  const [ values, setValue ] = useState<IValue>({})

  const errors = validate(list, values)
  const numberOfErrors = Object.keys(errors).length;
  const notEnoughSigners = needSigners && selected.length < signers;
  const haveErrors = numberOfErrors > 0 || notEnoughSigners;

  const [ processingStatus, setProcessingStatus ] = useState(false);

  const [ setResult ] = useSetExecutionResultsMutation();
  const { scriptFactory, transactionFactory, contractDeployment } =  useTemplateType();
  const { project, active, isSavingCode } = useProject();
  const { accounts } = project;

  const signersAccounts = selected.map(i => accounts[i]);

  const send = async ()=>{
    if (!processingStatus){
      setProcessingStatus(true);
    }

    // Map values to strings that will be passed to backend
    const args = list.map(arg => {
      const { name, type } = arg
      return JSON.stringify({ value : values[name], type })
    })

    let rawResult;
    try {
      // Process script
      if (type === EntityType.ScriptTemplate) {
        rawResult = await scriptFactory(args);
      }

      // Process transaction
      if (type === EntityType.TransactionTemplate){
        rawResult = await transactionFactory(signersAccounts, args);
      }

      if (type === EntityType.Account){
        if (
            accounts[active.index] &&
            accounts[active.index].deployedCode
        ) {
          if (
              !confirm("Redeploying will clear the state of all accounts. Proceed?")
          )
            setProcessingStatus(false);
            return;
        }
        rawResult = await contractDeployment()
      }

    } catch (e) {
      console.error(e)
      rawResult = e.toString();
    }

    setProcessingStatus(false);
    let resultType;
    switch (type) {
      case (EntityType.ScriptTemplate):
        resultType = ResultType.Script
        break;
      case (EntityType.TransactionTemplate):
        resultType = ResultType.Transaction
        break;
      default:
        resultType = ResultType.Contract
        break;
    }

    // Display result in the bottom area
    setResult({
      variables: {
        label: project.scriptTemplates[active.index].title,
        resultType,
        rawResult
      }
    });
  }

  const isOk = !haveErrors && (validCode !== undefined && !!validCode)
  let statusIcon = isOk ? <FaRegCheckCircle />: <FaRegTimesCircle/>;
  let statusMessage = isOk ? "Ready" : "Fix errors";

  const progress = isSavingCode || processingStatus;

  if (progress){
    statusIcon = <FaSpinner className="spin"/>
    statusMessage = "Please, wait..."
  }

  return(
    <>
      <div ref={constraintsRef} className="constraints"></div>
      <motion.div className="drag-box"
          drag={true}
          dragConstraints={constraintsRef}
          dragElastic={1}>
        <HoverPanel>
          {list.length > 0 &&
            <>
              <ArgumentsTitle
                type={type}
                errors={numberOfErrors}
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
          <ControlContainer isOk={isOk} progress={progress}>
            <StatusMessage>
                {statusIcon}
                <p>{statusMessage}</p>
            </StatusMessage>
            <ActionButton active={isOk} type={type} onClick={send}/>
          </ControlContainer>
        </HoverPanel>
      </motion.div>
    </>
  )
}

export default Arguments;
