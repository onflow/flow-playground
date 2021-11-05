import React, { useState, useRef, useEffect } from 'react';
import { navigate } from "@reach/router";
import { default as FlowButton } from 'components/Button';
import theme from '../theme';
import { Select, Spinner } from '@theme-ui/components';
import { useProject } from 'providers/Project/projectHooks';
import { isUUUID } from "util/url";
import { getInterpolatedTemplate } from 'util/templates';
import { getStorageData } from "util/storage";
import { storageMap } from 'util/accounts';

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

const TemplatePopup: React.FC<{
  visible: boolean;
  triggerClose?: (e: React.SyntheticEvent) => any;
}> = ({ visible, triggerClose }) => {
  
  const { project, mutator, selectedResourceAccount } = useProject();

  const selectedAcctState = project.accounts[storageMap[selectedResourceAccount] || 0].state;

  const { types, capabilities } = getStorageData(selectedAcctState);
  
  const capabilitiesKeys = Object.keys(capabilities || []);

  const [processing, setProcessing] = useState(false);
  const [templateName, setTemplateName] = useState("My amazing script or transaction");
  const [templateType, setTemplateType] = useState("Script");

  const [selectedCapability, setSelectedCapability] = useState< string | null >(capabilitiesKeys[0] || null);

  const projectPath = isUUUID(project.id) ? project.id : "local";

  const firstInput = useRef<HTMLInputElement>(null!);

  const storageAcct = selectedResourceAccount || 'none'

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
      onAnimationComplete={() => {setProcessing(false)}}
    >
      <PopupContainer 
        width="550px" 
        variants={popupFrames}
      >
        <PopupHeader mb="20px" color={theme.colors.darkGrey} lineColor={theme.colors.primary}>
          {`Create a ${templateType} from a template`}
        </PopupHeader>
        <InputBlock mb={'12px'}>
          <Label>Type</Label>
          <Select
            onChange={(event) => {
              setTemplateType(event.target.value)
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
        </InputBlock>
        <InputBlock mb={'12px'}>
          <Label>Capability</Label>
          <Select 
            onChange={(event) => {
              setSelectedCapability(event.target.value)
            }}
            defaultValue={capabilitiesKeys[0]}
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
            {capabilitiesKeys.map((capabilityKey) => 
              types[capabilityKey] === "Link" && 
                <option 
                  key={capabilityKey}
                  value={capabilityKey}
                >
                  {`${capabilityKey} - get and borrow the Capability`}
                </option>
            )}
          </Select>
        </InputBlock>
        <InputBlock mb={'24px'}>
          <Label>Name</Label>
          <Input
            ref={firstInput}
            value={templateName}
            onChange={event => setTemplateName(event.target.value)}
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
                const capData = capabilities[selectedCapability];

                if (templateType=== "Transaction") {
                    const res = await mutator.createTransactionTemplate(
                      getInterpolatedTemplate(
                        "tx", 
                        capData.contractAddr, 
                        capData.path, 
                        `${capData.resourceContract}.${capData.resource}`, 
                        capData.contractImplementedInterfaces.join(",")
                      ), 
                      templateName
                    )
                    navigate(`/${projectPath}?type=tx&id=${res.data?.createTransactionTemplate?.id}&storage=${storageAcct}`)
                } else if (templateType === "Script") {
                    const res = await mutator.createScriptTemplate(
                      getInterpolatedTemplate(
                        "script", 
                        capData.contractAddr, 
                        capData.path, 
                        `${capData.resourceContract}.${capData.resource}`, 
                        capData.contractImplementedInterfaces.join(",")
                      ), 
                      templateName
                    )
                    navigate(`/${projectPath}?type=script&id=${res.data?.createScriptTemplate?.id}&storage=${storageAcct}`)
                }
            
                triggerClose(null);
              }}
            >
              {processing ?
                <Spinner size="20" color="#303030"/>
                  :
                "Create"
              }
            </FlowButton>
        </SpaceBetween>
      </PopupContainer>
      <WhiteOverlay opacity={0.5} onClick={triggerClose} />
    </FullScreenContainer>
  );
};

export default TemplatePopup;
