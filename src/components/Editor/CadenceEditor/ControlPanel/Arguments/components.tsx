import PanelButton from 'components/PanelButton';
import { Stack } from 'layout/Stack';
import { EntityType } from 'providers/Project';
import { useProject } from 'providers/Project/projectHooks';
import React, { useState } from 'react';
import {
  FaArrowCircleRight,
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaSpinner,
} from 'react-icons/fa';
import CollapseOpenIcon from 'components/Icons/CollapseOpenIcon';
import { CadenceProblem } from 'util/language-syntax-errors';
import SingleArgument from './SingleArgument';
import {
  Badge,
  Controls,
  ErrorIndex,
  ErrorMessage,
  Heading,
  List,
  SingleError,
  Title,
} from './styles';
import {
  ArgumentsListProps,
  ArgumentsTitleProps,
  HintsProps,
  InteractionButtonProps,
} from './types';
import { useThemeUI } from 'theme-ui';

export const ArgumentsTitle: React.FC<ArgumentsTitleProps> = (
  props: ArgumentsTitleProps,
) => {
  const { type, errors, expanded, setExpanded } = props;

  const context = useThemeUI();
  const { theme } = context;

  const hasErrors = errors > 0;
  const lineColor = hasErrors ? String(theme.colors.error) : null;

  return (
    <Heading>
      <Title lineColor={lineColor} theme={theme}>
        {type === EntityType.ContractTemplate && 'Contract Arguments'}
        {type === EntityType.TransactionTemplate && 'Transaction Arguments'}
        {type === EntityType.ScriptTemplate && 'Script Arguments'}
      </Title>
      <Controls onClick={() => setExpanded(!expanded)}>
        {hasErrors && (
          <Badge theme={theme}>
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
}: ArgumentsListProps) => {
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

export const renderMessage = (message: string) => {
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

export const Hints: React.FC<HintsProps> = (props: HintsProps) => {
  const [expanded, setExpanded] = useState(true);
  const { problems, actions } = props;
  const { goTo, hideDecorations, hover } = actions;
  const context = useThemeUI();
  const { theme } = context;

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
        <Title theme={theme}>Warnings and Hints</Title>
        <Controls onClick={toggle} style={{ paddingRight: '10px' }}>
          {hintsAmount > 0 && (
            <Badge className="info" theme={theme}>
              <span>{hintsAmount}</span>
            </Badge>
          )}

          {CollapseOpenIcon()}
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
                theme={theme}
              >
                <ErrorIndex>
                  <span>{`${i + 1})`}</span>
                </ErrorIndex>
                <ErrorMessage theme={theme}>{message}</ErrorMessage>
              </SingleError>
            );
          })}
        </List>
      )}
    </Stack>
  );
};

export const EditorActionButton: React.FC<InteractionButtonProps> = ({
  label,
  enabled = true,
  progress = false,
  onClick,
}: InteractionButtonProps) => {
  const { getActiveCode, isSaving, isExecutingAction } = useProject();
  const code = getActiveCode()[0].trim();
  return (
    <Controls>
      <PanelButton
        onClick={onClick}
        Icon={progress ? FaSpinner : FaArrowCircleRight}
        disabled={isSaving || !enabled || code.length === 0}
        hideDisabledState={isSaving && !isExecutingAction}
      >
        {label}
      </PanelButton>
    </Controls>
  );
};
