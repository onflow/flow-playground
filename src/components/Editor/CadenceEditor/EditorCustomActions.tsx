import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { buildHashUrl } from 'util/url';

export const addCustomActions = (
  editorRef: monaco.editor.IStandaloneCodeEditor,
) => {
  // Adding custom action to the context menu
  editorRef.addAction({
    id: 'my-unique-action-id',
    label: 'Copy Highlight Link',
    contextMenuGroupId: '9_cutcopypaste', // Add to navigation group
    contextMenuOrder: 10.5, // Control the order in the context menu
    run: function (ed: any) {
      const selection = ed.getSelection();
      if (selection) {
        const { startLineNumber, endLineNumber } = selection;
        const newUrl = buildHashUrl([
          ...new Set([startLineNumber, endLineNumber]),
        ]);
        copyToClipboard(newUrl);
      }
    },
  });
};

function copyToClipboard(data: string) {
  navigator.clipboard.writeText(data).catch((err) => {
    console.error('Could not copy URL to clipboard', err);
  });
}
