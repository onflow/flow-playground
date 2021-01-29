// import { FaUnlink, FaRandom } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export enum ProblemType {
  Error = 'error',
  Warning = 'warning',
  Info = 'suggestion',
  Hint = 'hint',
  Unknown = "unknown"
}

export type Highlight = {
  startLine: number,
  startColumn: number,
  endLine: number,
  endColumn: number
}

export type CadenceProblem = {
  message: string,
  type: string,
  position: monaco.IPosition,
  icon: any,
  highlight: Highlight
}

export type ProblemsList = {
  [key: string]: CadenceProblem[]
}

const getMarkerType = (severity: number): ProblemType => {
  switch (true) {
    case (severity === 8):
      return ProblemType.Error
    case (severity === 4):
      return ProblemType.Warning
    case (severity === 2):
      return ProblemType.Info
    case (severity === 1):
      return ProblemType.Hint
    default:
      return ProblemType.Unknown
  }
}

export const formatMarker = (marker: monaco.editor.IMarker): CadenceProblem => {
  return {
    message: marker.message,
    type: getMarkerType(marker.severity),
    icon: FaExclamationTriangle,
    position: {
      lineNumber: marker.startLineNumber,
      column: marker.startColumn
    },
    highlight: {
      startLine: marker.startLineNumber,
      endLine: marker.endLineNumber,
      startColumn: marker.startColumn,
      endColumn: marker.endColumn
    }
  }
};

export const hasErrors = (problemList: any[]):boolean => {
  return problemList.filter(problem => problem.type === ProblemType.Error).length === 0
}

export const getIconByErrorType = (errorType: SyntaxError): any => {
  switch (errorType) {
    /*
    case SyntaxError.TypeMissmatch:
      return FaRandom;
    case SyntaxError.Generic:
      return FaExclamationTriangle;
    */
    default:
      return FaExclamationTriangle;
  }
};

export const goTo = (
  editor: monaco.editor.ICodeEditor,
  position: monaco.IPosition,
) => {
  editor.revealLineInCenter(position.lineNumber);
  editor.setPosition(position);
  editor.focus();
};
