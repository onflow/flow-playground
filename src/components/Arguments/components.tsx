import { Project } from 'api/apollo/generated/graphql';
import AccountPicker from 'components/AccountPicker';
import Button from 'components/Button';
import { Stack } from 'layout/Stack';
import { ActiveEditor, EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import {
  FaArrowCircleRight,
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { CadenceProblem } from 'util/language-syntax-errors';
import theme from '../../theme';
import SingleArgument from './SingleArgument';
import {
  Badge,
  Controls,
  ErrorIndex,
  ErrorMessage,
  Heading,
  List,
  SignersContainer,
  SignersError,
  SingleError,
  Title,
} from './styles';
import {
  ArgumentsListProps,
  ArgumentsTitleProps,
  ErrorListProps,
  HintsProps,
  InteractionButtonProps,
} from './types';

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
        {expanded ? (
          <FaCaretSquareUp cursor="pointer" opacity="0.2" size="18" />
        ) : (
          <FaCaretSquareDown cursor="pointer" opacity="0.2" size="18" />
        )}
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
    (acc, item, i) => {
      let current = acc.items[acc.items.length - 1];
      if (acc.startNew) {
        acc.startNew = false;
        acc.items.push(item);
        return acc;
      }

      if (item.startsWith('`')) {
        acc.startNew = true;
        const span = (
          <span className={spanClass} key={`${item}-${i}`}>
            {item.replace(/`/g, '')}
          </span>
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
  const { list, actions } = props;
  const { goTo, hideDecorations, hover } = actions;
  if (list.length === 0) {
    hideDecorations();
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
              key={i}
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
  const [expanded, setExpanded] = useState(true);
  const { problems, actions } = props;
  const { goTo, hideDecorations, hover } = actions;
  const toggle = () => {
    setExpanded(!expanded);
  };

  if (problems.warning.length === 0 && problems.info.length === 0) {
    return null;
  }
  const fullList = [...problems.warning, ...problems.info];
  const hintsAmount = fullList.length;
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
          {expanded ? (
            <FaCaretSquareUp cursor="pointer" opacity="0.2" />
          ) : (
            <FaCaretSquareDown cursor="pointer" opacity="0.2" />
          )}
        </Controls>
      </Heading>
      {expanded && (
        <List>
          {fullList.map((item: CadenceProblem, i) => {
            const message = renderMessage(item.message);
            return (
              <SingleError
                className={`hint-${item.type}`}
                key={i}
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

const getLabel = (type: EntityType, project: Project, active: ActiveEditor) => {
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
  const {
    project,
    active: activeEditor,
    getActiveCode,
    isSavingCode,
  } = useProject();
  const label = getLabel(type, project, activeEditor);
  const code = getActiveCode()[0].trim();
  return (
    <Controls>
      <Button
        onClick={onClick}
        Icon={FaArrowCircleRight}
        disabled={isSavingCode || !active || code.length === 0}
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
