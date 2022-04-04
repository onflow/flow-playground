import React, { useRef, useState } from 'react';
import {
  ActionButton,
  ArgumentsList,
  ArgumentsTitle,
  Signers,
} from 'components/Arguments/components';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';

import { IValue } from './types';
import { MotionBox, HoverPanel } from './components';
import { ControlContainer, StatusMessage } from 'components/Arguments/styles';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner } from 'react-icons/fa';
import { ExecuteCommandRequest } from 'monaco-languageclient';
import { ResultType } from 'api/apollo/generated/graphql';

const ControlPanel = (props) => {
  const { project, active, isSavingCode, lastSigners } = useProject();

  const { type } = active;
  const list = [];

  const [selected, updateSelectedAccounts] = useState([]);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [values, setValue] = useState<IValue>({});
  const [processingStatus, setProcessingStatus] = useState(false);

  const numberOfErrors = 0;
  const constraintsRef = useRef();
  const validCode = true;
  const signers = 5;

  const haveErrors = false;
  const isOk = !haveErrors && validCode !== undefined && !!validCode;
  let statusIcon = isOk ? <FaRegCheckCircle /> : <FaRegTimesCircle />;
  let statusMessage = isOk ? 'Ready' : 'Fix errors';
  const progress = isSavingCode || processingStatus;

  if (progress) {
    statusIcon = <FaSpinner className="spin" />;
    statusMessage = 'Please, wait...';
  }

  const send = () => {
    console.log('send');
  };

  return (
    <>
      <div ref={constraintsRef.current} className="constraints" />
      <MotionBox ref={constraintsRef}>
        <HoverPanel>
          {validCode && (
            <>
              {list.length > 0 && (
                <>
                  <ArgumentsTitle
                    type={type}
                    errors={numberOfErrors}
                    expanded={expanded}
                    setExpanded={setExpanded}
                  />
                  <ArgumentsList
                    list={list}
                    errors={errors}
                    hidden={!expanded}
                    onChange={(name, value) => {
                      let key = name.toString();
                      let newValue = { ...values, [key]: value };
                      setValue(newValue);
                    }}
                  />
                </>
              )}
            </>
          )}

          <ControlContainer isOk={isOk} progress={progress}>
            <StatusMessage>
              {statusIcon}
              <p>{statusMessage}</p>
            </StatusMessage>
            <ActionButton active={isOk} type={type} onClick={send} />
          </ControlContainer>
        </HoverPanel>
      </MotionBox>
    </>
  );
};

export default ControlPanel;
