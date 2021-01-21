// import { FaUnlink, FaRandom } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export enum SyntaxError {
  Generic = 'generic',
  MissingInitializer = 'init-missing',
  TypeMissmatch = 'type-missmatch',
}

export type Highlight = {
  startLine: number,
  startColumn: number,
  endLine: number,
  endColumn: number
}

export type CadenceSyntaxError = {
  message: string,
  type: string,
  position: monaco.IPosition,
  icon: any,
  highlight: Highlight
}

export const formatMarker = (marker: monaco.editor.IMarker): CadenceSyntaxError => {
  return {
    message: marker.message,
    type: SyntaxError.Generic,
    icon: FaExclamationTriangle,
    position: {
      lineNumber: marker.startLineNumber,
      column: marker.startColumn
    },
    highlight: {
      startLine: marker.startLineNumber,
      endLine: marker.endLineNumber,
      startColumn: marker.startLineNumber,
      endColumn: marker.startLineNumber
    }
  }
};

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
  editor.setPosition(position);
  editor.focus();
};
