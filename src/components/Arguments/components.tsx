import React, { useState } from 'react';
import { FaArrowCircleRight, FaExclamationTriangle, FaCaretSquareUp, FaCaretSquareDown } from 'react-icons/fa';
import { EntityType } from 'providers/Project';
import Button from 'components/Button';
import { useProject } from 'providers/Project/projectHooks';
import AccountPicker from 'components/AccountPicker';
import {
  Badge,
  Controls,
  Heading,
  List,
  Title,
  SignersContainer,
  SignersError,
  SingleError,
  ErrorIndex,
  ErrorMessage,
} from './styles';
import {
  ArgumentsListProps,
  ArgumentsTitleProps,
  InteractionButtonProps,
} from './types';
import SingleArgument from './SingleArgument';
import theme from '../../theme';
import { Stack } from 'layout/Stack';
import { CadenceProblem } from '../../util/language-syntax-errors';
import { ErrorListProps, HintsProps } from './types';

export const ArgumentsTitle: React.FC<ArgumentsTitleProps> = (props) => {
  const { type, errors, expanded, setExpanded } = props;

  const hasErrors = errors > 0;
  const lineColor = hasErrors ? theme.colors.error : null;

  return (
    <Heading>
      <Title lineColor={lineColor}>
        {type === EntityType.Account && 'Contract Arguments'}
        {type === EntityType.TransactionTemplate && 'Transaction Arguments'}
        {type === EntityType.ScriptTemplate && 'Script Arguments'}
      </Title>
      <Controls onClick={() => setExpanded(!expanded)}>
        {hasErrors && (
          <Badge>
            <span>{errors}</span>
          </Badge>
        )}
        {expanded ?
          <FaCaretSquareUp
            cursor="pointer"
            opacity="0.2"
            size="18"
          />
            :
          <FaCaretSquareDown
            cursor="pointer"
            opacity="0.2"
            size="18"
          />
        }
      </Controls>
    </Heading>
  );
};

export const ArgumentsList: React.FC<ArgumentsListProps> = ({
  list,
  errors,
  onChange,
  hidden,
}) => {
  return (
    <List hidden={hidden}>
      {list.map((argument) => {
        const { name, type } = argument;
        const error = errors[name];
        return name && type ? (
          <SingleArgument
            key={name}
            argument={argument}
            onChange={onChange}
            error={error}
          />
        ) : null;
      })}
    </List>
  );
};

const getSpanClass = (message: string): string => {
  // We can potentially bring better displayed messages later
  if (
    message.includes('exported declarations') ||
    message.includes('consider')
  ) {
    return 'suggestion';
  }

  return '';
};

const renderMessage = (message: string) => {
  let spanClass = getSpanClass(message);

  const { items } = message.split(' ').reduce(
    (acc, item) => {
      let current = acc.items[acc.items.length - 1];
      if (acc.startNew) {
        acc.startNew = false;
        acc.items.push(item);
        return acc;
      }

      if (item.startsWith('`')) {
        acc.startNew = true;
        const span = (
          <span className={spanClass}>{item.replace(/`/g, '')}</span>
        );
        acc.items.push(span);
        acc.startNew = true;
      } else {
        current = `${current} ${item}`;
        acc.items[acc.items.length - 1] = current;
        acc.startNew = false;
      }

      return acc;
    },
    { startNew: true, items: [] },
  );

  return items;
};

export const ErrorsList: React.FC<ErrorListProps> = (props) => {
  const { list, goTo, hideDecorations, hover } = props;
  if (list.length === 0) {
    return null;
  }
  return (
    <Stack>
      <Heading>
        <Title lineColor={theme.colors.error}>Problems</Title>
      </Heading>
      <List>
        {list.map((item: CadenceProblem, i) => {
          const message = renderMessage(item.message);
          return (
            <SingleError
              key={`${i}-${item.message}`}
              onClick={() => goTo(item.position)}
              onMouseOver={() => hover(item.highlight)}
              onMouseOut={() => hideDecorations()}
            >
              <ErrorIndex>
                <span>{i + 1}</span>
              </ErrorIndex>
              <ErrorMessage>{message}</ErrorMessage>
            </SingleError>
          );
        })}
      </List>
    </Stack>
  );
};

export const Hints: React.FC<HintsProps> = (props: HintsProps) => {
  const [ expanded, setExpanded ] = useState(true);
  const { problems, goTo, hideDecorations, hover } = props;

  const toggle = () => {
    setExpanded(!expanded);
  };

  if (problems.warning.length === 0 && problems.info.length === 0) {
    return null;
  }
  const fullList = [...problems.warning, ...problems.info];
  const hintsAmount = fullList.length
  return (
    <Stack>
      <Heading>
        <Title>Warnings and Hints</Title>
        <Controls onClick={toggle}>
          {hintsAmount > 0 && (
            <Badge className="green">
              <span>{hintsAmount}</span>
            </Badge>
          )}
          {expanded ?
            <FaCaretSquareUp
              cursor="pointer"
              opacity="0.2"
            />
              :
            <FaCaretSquareDown
              cursor="pointer"
              opacity="0.2"
            />
          }
        </Controls>
      </Heading>
      {expanded && (
        <List>
          {fullList.map((item: CadenceProblem, i) => {
            const message = renderMessage(item.message);
            return (
              <SingleError
                className={`hint-${item.type}`}
                key={`${i}-${item.message}`}
                onClick={() => goTo(item.position)}
                onMouseOver={() => hover(item.highlight)}
                onMouseOut={() => hideDecorations()}
              >
                <ErrorIndex>
                  <span>{i + 1}</span>
                </ErrorIndex>
                <ErrorMessage>{message}</ErrorMessage>
              </SingleError>
            );
          })}
        </List>
      )}
    </Stack>
  );
};

const getLabel = (type: EntityType) => {
  const { project, active } = useProject();
  const { accounts } = project;

  switch (true) {
    case type === EntityType.Account:
      return accounts[active.index].deployedCode ? 'Redeploy' : 'Deploy';
    case type === EntityType.TransactionTemplate:
      return 'Send';
    case type === EntityType.ScriptTemplate:
      return 'Execute';
    default:
      return 'Send';
  }
};

export const ActionButton: React.FC<InteractionButtonProps> = ({
  type,
  active = true,
  onClick,
}) => {
  const label = getLabel(type);
  const { isSavingCode } = useProject();
  const sendingTransaction = false;

  return (
    <Controls>
      <Button
        onClick={onClick}
        Icon={FaArrowCircleRight}
        disabled={isSavingCode || !active}
        isLoading={sendingTransaction}
      >
        {label}
      </Button>
    </Controls>
  );
};

type SignersProps = {
  maxSelection?: number;
  selected: number[];
  updateSelectedAccounts: (selection: number[]) => void;
};

export const Signers: React.FC<SignersProps> = (props) => {
  const { project } = useProject();
  const { accounts } = project;
  const { maxSelection, selected, updateSelectedAccounts } = props;

  const enoughSigners = selected.length < maxSelection;
  const lineColor = enoughSigners ? theme.colors.error : null;

  return (
    <SignersContainer>
      <Title lineColor={lineColor}>Transaction Signers</Title>
      <AccountPicker
        project={project}
        accounts={accounts}
        selected={selected}
        onChange={updateSelectedAccounts}
        maxSelection={maxSelection}
      />
      {enoughSigners && (
        <SignersError>
          <FaExclamationTriangle />
          Not enough signers...
        </SignersError>
      )}
    </SignersContainer>
  );
};
