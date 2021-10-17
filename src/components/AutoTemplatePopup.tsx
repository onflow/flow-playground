import React, { useState, useRef, useEffect } from 'react';
import { navigate } from "@reach/router";
import { default as FlowButton } from 'components/Button';
import theme from '../theme';
import { Select } from '@theme-ui/components';
import { useProject } from 'providers/Project/projectHooks';
import { isUUUID } from "../util/url";
import { getInterpolatedTemplate } from '../util/templates';
// import { Text } from '@theme-ui/components';
// import { transactionTemplates } from '../util/templates';

import {
  FullScreenContainer,
  PopupContainer,
  PopupHeader,
  WhiteOverlay,
  SpaceBetween,
} from 'components/Common';

import {
  Input,
  InputBlock,
  Label,
} from 'components/Arguments/SingleArgument/styles';

const AutoTemplatePopup: React.FC<{
  storage: { [identifier: string]: string};
  paths: { [identifier: string]: string};
  visible: boolean;
  options: { [identifier: string]: string};
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ storage,  paths, visible, options, triggerClose }) => {
  const { project, mutator, selectedResourceAccount } = useProject();

  // console.log("PATHS:", paths);
  // console.log("OPTIONS FORM POPUP:", options);
  // console.log("STORAGE FORM POPUP:", storage);

  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("My amazing script or transaction");

  // TODO: change this default based on input param
  // const [selectedTxTemplate, setSelectedTxTemplate] = useState< string >(Object.keys(transactionTemplates)[0])

  const [capability, setCapability] = useState< string | null >(Object.keys(options)[0] || null)

  // const [type, setType] = useState< string >("script")

  const [contractResource, setContractResource] = useState< string | null>(null)
  const [interfaces, setInterfaces] = useState< string | null>(null)

 useEffect(() => {
    if (capability && storage) {
      const storageBorrowType = storage[capability].value.value.borrowType
      
      let rxp = /{([^}]+)}/g
      let foundInterfaces = rxp.exec(storageBorrowType)[1]
      let fullyQualifiedInterfaces = foundInterfaces.split(',')
      let interfacesShort: string[] = []
      fullyQualifiedInterfaces.map((fullyQualifiedInterface) => {
        interfacesShort.push(fullyQualifiedInterface.split(".")[2] + "." + fullyQualifiedInterface.split(".")[3])
      })

      const interfacesFinalString = interfacesShort.join(",")
      setInterfaces(interfacesFinalString)

      const splitBorrowType = storageBorrowType.split(".")
      
      const contract = splitBorrowType[2]
      const resourceWithBracket = splitBorrowType[3]
      const resource = resourceWithBracket.split("{")[0]
      setContractResource(contract + "." + resource)
    }
  },[capability, storage])

  const projectPath = isUUUID(project.id) ? project.id : "local"

  const firstInput = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    firstInput.current.focus();
  }, [firstInput.current]);

  const containerFrames = {
    visible: {
      display: 'flex',
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
      zIndex: 20,
    },
    hidden: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0,
        staggerDirection: -1,
      },
      zIndex: -1,
    },
  };

  const spring = {
    type: 'spring',
    damping: 11,
    stiffness: 120,
  };

  const popupFrames = {
    visible: {
      opacity: 1,
      y: 0,
      transition: spring,
    },
    hidden: {
      opacity: 0,
      y: 200,
      transition: {
        ease: [1, 0.5, 0, 0]
      },
    },
  };

  return (
    <FullScreenContainer
      elevation={15}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      variants={containerFrames}
    >
      <PopupContainer width="550px" variants={popupFrames}>
        <PopupHeader mb="20px" color={theme.colors.darkGrey} lineColor={theme.colors.primary}>
          Create a Script or Transaction Template
        </PopupHeader>

        <InputBlock mb={'12px'}>
          <Label>Type</Label>
          <Select 
            onChange={(event) => {
              // setType(event.target.value)
            }}
            defaultValue="Script"
            sx={{
              border: "1px solid #C4C4C4",
              fontSize: "14px",
              color: "#000",
              padding: "8px",
              width: "100%",
              fontWeight: "bold",
              marginBottom: "5px",
              borderRadius: "2px"
            }}
          >
            <option>Script</option>
            <option>Transaction</option>
          </Select>
          <Label>Capability</Label>
          <Select 
            onChange={(event) => {
              // setSelectedTxTemplate(event.target.value)
              setCapability(event.target.value)
            }}
            defaultValue={Object.keys(options)[0]}
            sx={{
              border: "1px solid #C4C4C4",
              fontSize: "14px",
              color: "#000",
              padding: "8px",
              width: "100%",
              fontWeight: "bold",
              marginBottom: "5px",
              borderRadius: "2px"
            }}
          >
            {Object.keys(options).map((optionKey) => 
              options[optionKey] === "Link" && 
                <option 
                  key={optionKey}
                  value={optionKey}
                >
                  {`${optionKey} - get and borrow the Capability`}
                </option>
            )}
          </Select>
        </InputBlock>
        <InputBlock mb={'24px'}>
          <Label>Name</Label>
          <Input
            ref={firstInput}
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </InputBlock>
        <SpaceBetween>
          <FlowButton className="grey modal" onClick={triggerClose}>
            Close
          </FlowButton>
          <FlowButton
            className="green modal"
            onClick={async () => {
              setProcessing(true);
              // TODO: this is where a function call to the template util can return an interpolated string for the code text

              // const res = await mutator.createTransactionTemplate(getInterpolatedTemplate(path, contractResource, interfaces), name)
              const res = await mutator.createScriptTemplate(getInterpolatedTemplate(paths[capability], contractResource, interfaces), name)

              // navigate(`/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${selectedResourceAccount || 'none'}`)
              navigate(`/${projectPath}?type=script&id=${res.data?.createScriptTemplate?.id}&storage=${selectedResourceAccount || 'none'}`)

              setProcessing(false);
              triggerClose(null);
            }}
          >
            {processing ? "Processing..." : "Create"}
          </FlowButton>
        </SpaceBetween>
      </PopupContainer>
      <WhiteOverlay opacity={0.5} onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default AutoTemplatePopup;
