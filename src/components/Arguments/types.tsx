import {EntityType} from "providers/Project";

export type Argument = {
  name: string,
  type: string
}

export type InteractionButtonProps = {
  onClick: () => void,
  type: EntityType
}

export type ArgumentsTitleProps = {
  type: EntityType,
  expanded: boolean,
  toggleExpand: () => void,
  errors?: number
}

export type ArgumentsListProps = {
  list: Argument[]
}

