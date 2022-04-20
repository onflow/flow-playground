// import { FaUnlink, FaRandom } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  Range,
  IPosition,
  editor as monacoEditor,
} from 'monaco-editor/esm/vs/editor/editor.api';

export enum ProblemType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Hint = 'hint',
  Unknown = 'unknown',
}

export type Highlight = {
  color: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
};

export type CadenceProblem = {
  message: string;
  type: string;
  position: IPosition;
  icon: any;
  highlight: Highlight;
};

export type ProblemsList = {
  [key: string]: CadenceProblem[];
};

const getMarkerType = (severity: number): ProblemType => {
  switch (true) {
    case severity === 8:
      return ProblemType.Error;
    case severity === 4:
      return ProblemType.Warning;
    case severity === 2:
      return ProblemType.Info;
    case severity === 1:
      return ProblemType.Hint;
    default:
      return ProblemType.Unknown;
  }
};

export const formatMarker = (marker: monacoEditor.IMarker): CadenceProblem => {
  const markerType = getMarkerType(marker.severity);

  return {
    type: markerType,
    message: marker.message,
    icon: FaExclamationTriangle,
    position: {
      lineNumber: marker.startLineNumber,
      column: marker.startColumn,
    },
    highlight: {
      color: markerType,
      startLine: marker.startLineNumber,
      endLine: marker.endLineNumber,
      startColumn: marker.startColumn,
      endColumn: marker.endColumn,
    },
  };
};

export const hasErrors = (problemList: any[]): boolean => {
  return (
    problemList.filter((problem) => problem.type === ProblemType.Error)
      .length === 0
  );
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
  editor: monacoEditor.ICodeEditor,
  position: IPosition,
): void => {
  editor.revealLineInCenter(position.lineNumber);
  editor.setPosition(position);
  editor.focus();
};

export const hover = (
  editor: monacoEditor.ICodeEditor,
  highlight: Highlight,
): void => {
  const { startLine, startColumn, endLine, endColumn, color } = highlight;
  const model = editor.getModel();

  const selection = model.getAllDecorations().find((item: any) => {
    return (
      item.range.startLineNumber === startLine &&
      item.range.startColumn === startColumn
    );
  });

  const selectionEndLine = selection ? selection.range.endLineNumber : endLine;
  const selectionEndColumn = selection ? selection.range.endColumn : endColumn;

  const highlightLine = [
    {
      range: new Range(startLine, startColumn, endLine, endColumn),
      options: {
        isWholeLine: true,
        className: `playground-syntax-${color}-hover`,
      },
    },
    {
      range: new Range(
        startLine,
        startColumn,
        selectionEndLine,
        selectionEndColumn,
      ),
      options: {
        isWholeLine: false,
        className: `playground-syntax-${color}-hover-selection`,
      },
    },
  ];
  editor.getModel().deltaDecorations([], highlightLine);
  editor.revealLineInCenter(startLine);
};

export const hideDecorations = (editor: monacoEditor.ICodeEditor): void => {
  const model = editor.getModel();
  let current = model
    .getAllDecorations()
    .filter((item) => {
      const { className } = item.options;
      return className?.includes('playground-syntax');
    })
    .map((item) => item.id);

  model.deltaDecorations(current, []);
};
