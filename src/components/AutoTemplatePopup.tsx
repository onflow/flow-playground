import React, { useState, useRef, useEffect } from 'react';
import { navigate } from "@reach/router";
import { default as FlowButton } from 'components/Button';
import theme from '../theme';
import { Select } from '@theme-ui/components';
import { useProject } from 'providers/Project/projectHooks';
import { isUUUID } from "../util/url";
import { getInterpolatedTemplate } from '../util/templates';
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
  visible: boolean;
  options: { [identifier: string]: string};
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, options, triggerClose }) => {
  const { project, mutator, selectedResourceAccount } = useProject();

  // console.log("OPTIONS FORM POPUP:", options);

  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("My amazing script or transaction");

  // TODO: change this default based on input param
  // const [selectedTxTemplate, setSelectedTxTemplate] = useState< string >(Object.keys(transactionTemplates)[0])

  const [codeSnippet, setCodeSnippet] = useState< string | null >(Object.keys(options)[0] || null)
  // console.log("CODE SNIPPET:", codeSnippet);

  useEffect(() => {
    codeSnippet && console.log("INTERPOLATED CODE:", getInterpolatedTemplate(codeSnippet))
  },[codeSnippet])

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
          <Label>Select</Label>
          <Select 
            onChange={(event) => {
              // setSelectedTxTemplate(event.target.value)
              setCodeSnippet(event.target.value)
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
              options[optionKey] === "Link" && <option key={optionKey}>{optionKey}</option>
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
              // const res = await mutator.createTransactionTemplate(transactionTemplates[selectedTxTemplate], name)
              const res = await mutator.createTransactionTemplate(getInterpolatedTemplate(codeSnippet), name)
              navigate(`/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${selectedResourceAccount || 'none'}`)
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
