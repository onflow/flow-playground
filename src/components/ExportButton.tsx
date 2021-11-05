import React from 'react';
import useClipboard from 'react-use-clipboard';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import { SidebarItemExport } from 'layout/SidebarItemExport';
import { useProject } from 'providers/Project/projectHooks';
import { generateCode } from 'util/generate-code';

type ExportButtonProps = {
  id: string;
  typeName: string;
};

export const ExportButton = (props: ExportButtonProps) => {
  const { project } = useProject();
  const { id, typeName } = props;
  const code = generateCode(project.id, id, typeName);
  const [isCopied, setCopied] = useClipboard(code, {
    successDuration: 1000,
  });

  return project.id === 'LOCAL-project' ? null : (
    <SidebarItemExport
      onClick={setCopied}
      title={'Copy snippet to clipboard'}
      active={isCopied}
    >
      {isCopied ? <FaClipboardCheck /> : <FaClipboard />}
    </SidebarItemExport>
  );
};
